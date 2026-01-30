import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  SemanticAnchors,
  SubType,
  updateSubTypeAnchors,
} from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysUpdateSubType } from '@/app/commands/sysSubtype.ts';

export function updateSubTypeAnchorThunk({
  subtypeId,
  anchors,
}: {
  subtypeId: string;
  anchors: SemanticAnchors;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      logger.snError(
        'Anchors must not be working cuz that subtype is GONE. Please report.'
      );
      return;
    }
    if (!checkAdmin(subtype.system)) return;

    const oldAnchors = cloneDeep(subtype.anchors || {});

    try {
      dispatch(
        updateSubTypeAnchors({
          subtypeId: subtypeId,
          anchors,
          system: subtype.system,
        })
      );

      if (subtype.system) {
        await sysUpdateSubType({
          id: subtypeId,
          anchors,
        });
      } else {
        await subTypeCommands.updateSubType({
          id: subtypeId,
          anchors,
        });
      }

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subtypeId,
          keypath: subtypeId,
        })
      );
    } catch (error) {
      dispatch(
        updateSubTypeAnchors({
          subtypeId: subtypeId,
          anchors: oldAnchors,
          system: subtype.system,
        })
      );
      logger.snError(
        'Anchors keep us grounded but these are lost in the cloud. (Server said no; please report)',
        { error }
      );
    }
  };
}
