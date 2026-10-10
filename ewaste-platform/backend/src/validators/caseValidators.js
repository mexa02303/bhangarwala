const { z } = require('zod');

const caseSubmissionSchema = z.object({
  productName: z.string().min(2, 'Product name is required'),
  category: z.enum([
    'mobile phone',
    'laptop',
    'desktop',
    'monitor',
    'tablet',
    'battery',
    'charger',
    'keyboard',
    'mouse',
    'printer',
    'television',
    'cable',
    'appliance',
    'other'
  ]),
  brand: z.string().optional(),
  model: z.string().optional(),
  approxAge: z.string().optional(),
  quantity: z.number().int().min(1).optional().default(1),
  physicalCondition: z.enum(['working', 'partially working', 'damaged', 'not working']),
  visibleDamage: z.string().optional(),
  missingComponents: z.string().optional(),
  batteryStatus: z.string().optional(),
  description: z.string().optional(),
  pickupAddress: z.string().optional(),
  preferredContact: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    key: z.string().optional()
  })).optional()
});

const statusUpdateSchema = z.object({
  status: z.enum([
    'Submitted',
    'Under Review',
    'Agent Assigned',
    'Assessment Confirmed',
    'Awaiting Collection',
    'Collected',
    'Repair / Refurbishment / Recycling',
    'Completed',
    'Rejected',
    'Cancelled',
    'Needs More Information'
  ]),
  reasonOrNotes: z.string().optional()
});

const noteSchema = z.object({
  note: z.string().min(1, 'Note content cannot be empty'),
  isInternal: z.boolean().optional().default(false)
});

module.exports = {
  caseSubmissionSchema,
  statusUpdateSchema,
  noteSchema
};
