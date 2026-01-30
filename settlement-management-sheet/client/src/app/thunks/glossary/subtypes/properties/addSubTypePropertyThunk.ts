import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  addSubTypeProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import userSubTypeCommands from '@/app/commands/userSubtype.ts';
import { GenericObject } from '../../../../../../../shared/types/common.ts';
import { sysCreateSubTypeProperty } from '@/app/commands/sysSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';
import verifyUserAdmin from '@/hooks/auth/verifyUserAdmin.ts';

export function addSubTypePropertyThunkRoot({
  property,
}: {
  property: SubTypeProperty;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const user = state.user;
    const isSystem = verifyUserAdmin();
    try {
      const customProperty = cloneDeep(property);

      dispatch(
        addSubTypeProperty({
          properties: [customProperty],
          system: isSystem,
        })
      );

      let newProperty: SubTypeProperty;
      if (isSystem) {
        newProperty = await sysCreateSubTypeProperty({
          id: property.id,
          name: property.name,
          inputType: property.inputType,
          shape: property.shape as GenericObject,
        });
      } else {
        newProperty = await userSubTypeCommands.createSubTypeProperty({
          id: property.id,
          name: property.name,
          createdBy: user.id as string,
          inputType: property.inputType,
          shape: property.shape as GenericObject,
        });
      }

      if (!newProperty) {
        logger.snError(
          'We need a detective for the case of the missing property!'
        );
      }

      dispatch(
        addSubTypeProperty({
          properties: [newProperty],
          system: newProperty.system,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: property.id,
          keypath: `${property.id}`,
        })
      );
    } catch (error) {
      logger.snError(
        "Server said, 'New phone, who dis?' What a jerk. Report that bug!",
        { error }
      );
    }
  };
}
