import prisma from '../db/db.js';

const getUserAttributes = async (req, res) => {
  try {
    let userId = req?.user?.id || 'Admin';
    const { limit = 10, offset = 0, search = '' } = req.query;

    const attributes = await prisma.attribute.findMany({
      where: {
        createdBy: userId,
        name: { contains: search, mode: 'insensitive' },
      },
      distinct: ['refId'],
      orderBy: [{ updatedAt: 'desc' }], // Get most recent version
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        refId: true, // Keep for tracking versions
        name: true,
        description: true,
        tags: true,
        status: true, // Draft or Published
      },
    });

    res.json({ items: attributes, nextOffset: offset + attributes.length });
  } catch (error) {
    console.error('Error getting personal attributes:', error);
    return res
      .status(500)
      .json({ message: 'Error getting personal attributes.' });
  }
};

const getCommunityAttributes = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = '' } = req.query;

    const attributes = await prisma.attribute.findMany({
      where: {
        status: 'PUBLISHED',
        name: { contains: search, mode: 'insensitive' },
      },
      distinct: ['refId'], // Get only the latest version per refId
      orderBy: [{ refId: 'asc' }, { updatedAt: 'desc' }], // Prioritize latest update
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        refId: true, // For version tracking
        name: true,
        createdBy: true,
        contentType: true,
        description: true,
        tags: true,
      },
    });

    res.json({ items: attributes, nextOffset: offset + attributes.length });
  } catch (error) {
    console.error('Error getting community attributes:', error);
    return res
      .status(500)
      .json({ message: 'Error getting community attributes.' });
  }
};

const getAttributeById = async (req, res) => {
  console.log('we trying');
  try {
    const { id } = req.params;
    const attribute = await prisma.attribute.findUnique({ where: { id } });
    res.json(attribute);
  } catch (error) {
    console.error('Error getting attribute by id:', error);
    return res.status(500).json({ message: 'Error getting attribute by id.' });
  }
};

const saveAttribute = async (req, res) => {
  try {
    const { refId, ...rest } = req.body;

    // Find the most recently updated item with the given refId
    const latestAttribute = await prisma.attribute.findFirst({
      where: { refId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!latestAttribute) {
      // If no attribute is found, call createAttribute logic
      const newAttribute = await prisma.attribute.create({
        data: { refId, ...rest },
      });
      return res.status(201).json({
        message: 'Attribute created successfully.',
        attribute: newAttribute,
      });
    }

    // If an attribute is found, update the most recent item
    const updatedAttribute = await prisma.attribute.update({
      where: { id: latestAttribute.id },
      data: rest,
    });

    return res.status(200).json({
      message: 'Attribute updated successfully.',
      attribute: updatedAttribute,
    });
  } catch (error) {
    console.error('Error saving attribute:', error);
    return res.status(500).json({ message: 'Error saving attribute.' });
  }
};

const publishAttribute = async (req, res) => {
  console.log('we trying to publish');
  try {
    console.log('body', req.body);
    const { refId, id } = req.body;
    await prisma.attribute.update({
      where: { refId, id },
      data: { status: 'PUBLISHED' },
    });
    return res.status(200).json({
      message: 'Attribute published successfully.',
    });
  } catch (error) {
    console.error('Error publishing attribute:', error);
    return res.status(500).json({ message: 'Error publishing attribute.' });
  }
};

export {
  saveAttribute,
  getUserAttributes,
  getCommunityAttributes,
  getAttributeById,
  publishAttribute,
};
