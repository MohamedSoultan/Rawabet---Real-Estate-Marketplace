import { create } from 'zustand';
import { 
  Lead, 
  LeadStatus, 
  LeadChannel, 
  LeadActivity, 
  LeadNote 
} from '../types';
import { INITIAL_LEADS } from '../data/initialData';

interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;

  // Selectors
  getLeadsByStatus: (status: LeadStatus) => Lead[];
  getLeadsByAssignee: (agentId: string) => Lead[];

  // Actions
  createOrUpdateLead: (params: {
    propertyId: string;
    propertyReference?: string;
    propertyTitle?: string;
    customerName: string;
    customerMobile: string;
    channel: LeadChannel;
    notes?: string;
    customerId?: string;
  }) => Lead;
  updateLeadStatus: (leadId: string, status: LeadStatus, note?: string) => void;
  assignLead: (leadId: string, assigneeId: string, assigneeName: string) => void;
  addLeadNote: (leadId: string, noteContent: string, authorName: string, authorId?: string) => void;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: INITIAL_LEADS,
  isLoading: false,
  error: null,

  getLeadsByStatus: (status) => get().leads.filter(l => l.status === status),
  getLeadsByAssignee: (agentId) => get().leads.filter(l => l.assigned_to === agentId),

  createOrUpdateLead: ({ propertyId, propertyReference, propertyTitle, customerName, customerMobile, channel, notes, customerId }) => {
    const cleanMobile = customerMobile.replace(/\D/g, '');
    const { leads } = get();

    // Deduplication check: Is there an existing open lead for this mobile & property?
    const existingLead = leads.find(l => 
      l.property_id === propertyId && 
      l.customer_mobile.replace(/\D/g, '') === cleanMobile &&
      l.status !== 'WON' && 
      l.status !== 'LOST'
    );

    if (existingLead) {
      // Append activity rather than creating duplicate
      const newActivity: LeadActivity = {
        id: `ACT-${Date.now()}`,
        lead_id: existingLead.id,
        activity_type: channel === 'WHATSAPP' ? 'WHATSAPP_CONTACT_INITIATED' : 'CALL_CONTACT_INITIATED',
        channel,
        description: `تواصل متكرر عبر قناة ${channel === 'WHATSAPP' ? 'واتساب' : 'الاتصال الهاتفي'}`,
        created_at: new Date().toISOString()
      };

      const newNotesList: LeadNote[] = [...(existingLead.notes || [])];
      if (notes) {
        newNotesList.push({
          id: `NOTE-${Date.now()}`,
          lead_id: existingLead.id,
          user_id: customerId || 'system',
          user_name: customerName,
          body: notes,
          created_at: new Date().toISOString()
        });
      }

      const updated: Lead = {
        ...existingLead,
        activities: [newActivity, ...(existingLead.activities || [])],
        notes: newNotesList,
        last_activity_at: new Date().toISOString()
      };

      set({ leads: leads.map(l => l.id === existingLead.id ? updated : l) });
      return updated;
    }

    // New Lead
    const leadId = `LEAD-${Date.now()}`;
    const initialNotes: LeadNote[] = [];
    if (notes) {
      initialNotes.push({
        id: `NOTE-${Date.now()}`,
        lead_id: leadId,
        user_id: customerId || 'system',
        user_name: customerName,
        body: notes,
        created_at: new Date().toISOString()
      });
    }

    const newLead: Lead = {
      id: leadId,
      reference_number: `RAW-LD-${Date.now().toString().slice(-6)}`,
      property_id: propertyId,
      property_reference: propertyReference || 'RAW-KFS-000001',
      property_title: propertyTitle || 'عقار روابط',
      customer_id: customerId || `cust-${Date.now()}`,
      customer_name: customerName,
      customer_mobile: customerMobile,
      customer_email: `${customerMobile}@customer.rawabet.com`,
      contact_channel: channel,
      source: 'الموقع الإلكتروني',
      status: channel === 'WHATSAPP' ? 'WHATSAPP_CONTACT_INITIATED' : 'CALL_CONTACT_INITIATED',
      notes: initialNotes,
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      activities: [
        {
          id: `ACT-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'CREATED',
          channel,
          description: `تم تسجيل طلب اهتمام جديد بالعقار عبر ${channel === 'WHATSAPP' ? 'واتساب' : 'مكالمة هاتفية'}`,
          created_at: new Date().toISOString()
        }
      ]
    };

    set({ leads: [newLead, ...leads] });
    return newLead;
  },

  updateLeadStatus: (leadId, status, note) => {
    set(state => ({
      leads: state.leads.map(l => {
        if (l.id !== leadId) return l;

        const newActivity: LeadActivity = {
          id: `ACT-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'STATUS_CHANGED',
          description: `تغيير حالة الطلب إلى ${status}${note ? `: ${note}` : ''}`,
          created_at: new Date().toISOString()
        };

        const updatedNotes = [...(l.notes || [])];
        if (note) {
          updatedNotes.push({
            id: `NOTE-${Date.now()}`,
            lead_id: leadId,
            user_id: 'system',
            user_name: 'النظام',
            body: `تحديث حالة: ${note}`,
            created_at: new Date().toISOString()
          });
        }

        return {
          ...l,
          status,
          activities: [newActivity, ...(l.activities || [])],
          notes: updatedNotes,
          last_activity_at: new Date().toISOString()
        };
      })
    }));
  },

  assignLead: (leadId, assigneeId, assigneeName) => {
    set(state => ({
      leads: state.leads.map(l => {
        if (l.id !== leadId) return l;

        const newActivity: LeadActivity = {
          id: `ACT-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'ASSIGNED',
          description: `تم إسناد الطلب إلى مسؤول المبيعات: ${assigneeName || assigneeId}`,
          created_at: new Date().toISOString()
        };

        return {
          ...l,
          assigned_to: assigneeId,
          assigned_user_name: assigneeName,
          activities: [newActivity, ...(l.activities || [])],
          last_activity_at: new Date().toISOString()
        };
      })
    }));
  },

  addLeadNote: (leadId, noteContent, authorName, authorId) => {
    set(state => ({
      leads: state.leads.map(l => {
        if (l.id !== leadId) return l;

        const newNote: LeadNote = {
          id: `NOTE-${Date.now()}`,
          lead_id: leadId,
          user_id: authorId || 'user-internal',
          user_name: authorName,
          body: noteContent,
          created_at: new Date().toISOString()
        };

        const newActivity: LeadActivity = {
          id: `ACT-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'NOTE_ADDED',
          description: `${authorName}: ${noteContent}`,
          created_at: new Date().toISOString()
        };

        return {
          ...l,
          notes: [...(l.notes || []), newNote],
          activities: [newActivity, ...(l.activities || [])],
          last_activity_at: new Date().toISOString()
        };
      })
    }));
  }
}));
