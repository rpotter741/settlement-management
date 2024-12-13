import { Event } from './models/eventModel.js';
import { EventTemplate } from './models/eventTemplateModel.js';

const createEventFromTemplate = async (templateId, initializationData) => {
  try {
    // Step 1: Fetch the template
    const eventTemplate = await EventTemplate.findById(templateId);

    if (!eventTemplate) {
      throw new Error('EventTemplate not found');
    }

    // Step 2: Merge template with initialization data
    const eventData = {
      ...eventTemplate.toObject(), // Converts Mongoose document to plain object
      ...initializationData, // Dynamic gameplay-specific data
    };

    // Step 3: Remove fields you don't want to carry over (like _id)
    delete eventData._id;

    // Step 4: Create and save the new event
    const event = new Event(eventData);
    await event.save();

    console.log('Event created successfully:', event);
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};
