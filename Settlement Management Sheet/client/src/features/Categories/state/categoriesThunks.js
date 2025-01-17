import { updateCategory } from '../features/category/categoriesSlice';
import { updateAttribute } from '../features/attribute/attributesSlice';

export const updateAttributeInCategory =
  (categoryId, attributeId, updates) => async (dispatch, getState) => {
    const state = getState();
    const category = state.categories.byId[categoryId];

    if (!category) throw new Error(`Category ${categoryId} not found`);
    if (!category.attributes.includes(attributeId))
      throw new Error(
        `Attribute ${attributeId} is not part of Category ${categoryId}`
      );

    // Update the attribute
    dispatch(updateAttribute({ id: attributeId, updates }));

    // Optionally update category metadata
    dispatch(
      updateCategory({
        id: categoryId,
        updates: { lastModified: new Date().toISOString() },
      })
    );
  };
