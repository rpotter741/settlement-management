import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import { Box, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import SubTypeFormPreview from './previews/SubTypeFormPreview.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import {
  generateCompoundPropertyValue,
  generateFormSource,
} from '@/features/Glossary/utils/generatePropertyValue.js';
import { set } from 'lodash';

const PreviewOrchestrator = ({
  subType,
  glossaryId,
  mode,
  editId,
}: {
  subType: any;
  glossaryId: string | null;
  mode: 'focus' | 'form' | 'preview';
  editId: string | null;
}) => {
  const [source, setSource] = useState(generateFormSource(subType));

  const onAddData = (
    sourceProperty: any,
    groupId: string,
    propertyId: string
  ) => {
    console.log(source.groups[groupId].properties[propertyId]);
    const newData = generateCompoundPropertyValue(sourceProperty, propertyId);
    const addition = newData.value[newData.order[0]];
    console.log(addition);
    setSource((prev) => ({
      ...prev,
      groups: {
        ...prev.groups,
        [groupId]: {
          //@ts-ignore
          ...prev.groups[groupId],
          properties: {
            //@ts-ignore
            ...prev.groups[groupId].properties,
            [propertyId]: {
              //@ts-ignore
              ...prev.groups[groupId].properties[propertyId],
              value: {
                //@ts-ignore
                ...prev.groups[groupId].properties[propertyId].value,
                [newData.order[0]]: addition,
              },
              order: [
                //@ts-ignore
                ...prev.groups[groupId].properties[propertyId].order,
                newData.order[0],
              ],
            },
          },
        },
      },
    }));
  };

  const handleChange = ({
    gId,
    pId,
    vId,
    side,
    value,
  }: {
    gId: string;
    pId: string;
    vId?: string;
    side?: 'left' | 'right';
    value: any;
  }) => {
    const newSource = { ...source };
    if (vId && side) {
      set(
        newSource,
        `groups.${gId}.properties.${pId}.value.${vId}.${side}.value`,
        value
      );
    } else {
      set(newSource, `groups.${gId}.properties.${pId}.value`, value);
    }
    console.log(newSource);
    setSource(newSource);
  };

  const tabs = useMemo(() => {
    return subType.groupOrder.map((groupId: string) => {
      const group = subType.groupData[groupId];
      return {
        name: group.name,
        key: groupId,
        props: {
          glossaryId,
          subType,
          groupId,
          mode,
          source,
          onAddData,
          editId,
          handleChange,
        },
      };
    });
  }, [subType, source]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);

  const handleTabClick = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    setLastIndex(activeIndex);
    setActiveIndex(index);
  };

  const componentMap = useMemo(() => {
    return tabs.reduce((acc: GenericObject, tab: any) => {
      acc[tab.name] = SubTypeFormPreview;
      return acc;
    }, {});
  }, [subType]);

  return (
    <PageBox mode="edit" variant="default">
      <TextField
        variant="outlined"
        fullWidth
        label="Name"
        defaultValue={`New ${subType.name} Entry`}
        sx={{ mt: 4 }}
      />
      <TabbedContent
        tabs={tabs}
        componentMap={componentMap}
        activeTab={activeTab}
        handleTabClick={(tabName, index) => handleTabClick(tabName, index)}
        lastIndex={lastIndex}
        isTool={false}
      ></TabbedContent>
    </PageBox>
  );
};

export default PreviewOrchestrator;
