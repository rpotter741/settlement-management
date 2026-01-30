import { useEffect, useState } from 'react';
import ToolInput from '@/components/shared/DynamicForm/ToolInput.js';
import ToolSelect from '@/components/shared/DynamicForm/ToolSelect.js';
import ToolSwitch from '@/components/shared/DynamicForm/ToolSwitch.js';
import CollapseOnRemoval from '@/components/shared/Layout/Motion/CollapseOnRemoval.js';
import { useShellContext } from '@/context/ShellContext.js';
import { useTools } from '@/hooks/tools/useTools.js';

interface ValueToggleHellProps {
  disabled: boolean;
  property: string;
  fields: Record<string, any>; // Replace with actual type if available
  slide: number;
  setSlide: (value: number) => void;
  slideLabel?: string;
  slideColor?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'honey';
  borderColor?: string;
  accentColor?: string;
}

type ScaleCurve = 'linear' | 'slow-exponential' | 'fast-exponential' | 'custom';

const changePerIntervalLabel: Record<
  ScaleCurve,
  'Base' | 'Change Per Interval'
> = {
  linear: 'Change Per Interval',
  'slow-exponential': 'Base',
  'fast-exponential': 'Base',
  custom: 'Change Per Interval',
};

const ValueToggleHell: React.FC<ValueToggleHellProps> = ({
  disabled,
  property,
  fields,
  borderColor = 'honey.main',
  accentColor = 'info.main',
}) => {
  const { id, tool } = useShellContext();
  const { edit, updateTool, selectEditValue } = useTools(tool, id);
  const [focused, setFocused] = useState(false);

  const source = selectEditValue(`balance.${property}`);
  if (!source) return null;
  const { interval, scaleCurve, valuesPerInterval } = source;

  const getIntervals = () => {
    const source = edit.balance[property];
    const { interval, scaleToggle, valuesPerInterval } = source;
    if (interval <= 0) return [];

    const valueMap: Record<number, number> = {};

    valuesPerInterval.forEach((value: { level: number; value: number }) => {
      if (value && value.level && value.value !== undefined) {
        valueMap[value.level] = value.value;
      }
    });

    if (scaleToggle) {
      const values = Array.from(
        { length: Math.ceil(21 / interval) },
        (_, i) => i * interval
      )
        .slice(1, 21)
        .map((value) => {
          return {
            level: value,
            value: 0,
          };
        });
      updateTool(`balance.${property}.valuesPerInterval`, values);
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (scaleCurve === 'custom') getIntervals();
  }, [scaleCurve, interval]);

  return (
    <CollapseOnRemoval
      show={!disabled}
      sx={{
        gridColumn: 'span 2',
        display: 'grid',
        gridTemplateColumns: '5fr 1fr',
        alignItems: 'center',
        border: '1px solid',
        borderColor: edit?.balance[property].perLevel
          ? focused
            ? accentColor
            : borderColor
          : 'transparent',
        transition: 'border-color 0.3s ease, padding 0.3s ease',
        boxSizing: 'border-box',
        p: edit.balance[property].perLevel ? 1 : 0,
        borderRadius: 2,
      }}
      onMouseEnter={setFocused.bind(null, true)}
      onMouseLeave={setFocused.bind(null, false)}
    >
      <ToolInput inputConfig={fields[`${property}PerLevel`]} />
      <ToolSwitch
        keypath={`balance.${property}.perLevel`}
        trueLabel="Scale"
        falseLabel="Flat"
        tooltip="Enable to automatically adjust related values when max per level changes."
        border={false}
        variant="column-reverse"
        disabled={disabled}
        heightLock={true}
      />
      <CollapseOnRemoval
        show={edit?.balance[property].perLevel}
        sx={{
          gridColumn: 'span 2',
          display: 'grid',
          gridTemplateColumns: '5fr 1fr',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ToolInput
          inputConfig={fields[`${property}IntervalPerLevel`]}
          decimals={0}
          allowZero={false}
        />
        <ToolSwitch
          keypath={`balance.${property}.scaleToggle`}
          trueLabel="Custom"
          falseLabel="Default"
          variant="column-reverse"
          tooltip="Enable scaling separate from the base value."
          border={false}
          heightLock={true}
        />
        <CollapseOnRemoval
          show={edit?.balance[property].scaleToggle}
          sx={{
            gridColumn: 'span 2',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ToolInput
            dynamicLabel={
              changePerIntervalLabel[
                edit?.balance[property].scaleCurve as ScaleCurve
              ]
            }
            inputConfig={fields[`${property}ValuePerLevel`]}
            style={{ width: '100%' }}
            disabled={edit?.balance[property].scaleCurve === 'custom'}
          />
          <ToolSelect
            keypath={`balance.${property}.scaleCurve`}
            label="Scale Curve"
            options={[
              { value: 'linear', name: 'Linear' },
              { value: 'slow-exponential', name: 'Slow Exponential (^1.5)' },
              { value: 'fast-exponential', name: 'Fast Exponential (^2)' },
              { value: 'custom', name: 'Per Interval' },
            ]}
            small={false}
          />
          <CollapseOnRemoval
            show={edit?.balance[property].scaleCurve === 'custom'}
            sx={{
              gridColumn: 'span 2',
              display: 'grid',
              gridTemplateColumns: [
                '1fr',
                '1fr 1fr',
                'repeat(3, 1fr)',
                'repeat(4, 1fr)',
                'repeat(5, 1fr)',
              ],
              gap: 1,
              width: '100%',
            }}
          >
            {valuesPerInterval.map(
              (interval: { level: number; value: number }, index: number) => (
                <ToolInput
                  key={`${property}-interval-${index}`}
                  inputConfig={{
                    keypath: `balance.${property}.valuesPerInterval.${index}.value`,
                    label: `Level ${interval.level}`,
                    type: 'number',
                  }}
                  style={{ width: '100%' }}
                />
              )
            )}
          </CollapseOnRemoval>
        </CollapseOnRemoval>
      </CollapseOnRemoval>
    </CollapseOnRemoval>
  );
};

export default ValueToggleHell;
