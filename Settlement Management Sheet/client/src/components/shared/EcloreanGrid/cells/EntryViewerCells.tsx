import { Button, Checkbox } from '@mui/material';
import EcloreanCell from '../EcloreanCell.js';

interface CheckCellProps {
  width: number;
  selected: boolean;
  onSelect: (id: string) => void;
  id: string;
}

interface NameCellProps {
  width: number;
  name: string;
}

interface IconCellProps {
  width: number;
  icon: React.ReactNode;
}

interface ParentCellProps {
  width: number;
  parent: string;
}

interface ChildrenCellProps {
  width: number;
  children: any[];
  onChildrenMenu?: (children: any[]) => void;
}

interface TemplateCellProps {
  width: number;
  templateId?: string;
}

const CheckCell = ({ width, selected, onSelect, id }: CheckCellProps) => {
  //
  return (
    <EcloreanCell
      width={`${width}px`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Checkbox checked={selected} onChange={() => onSelect(id)} />
    </EcloreanCell>
  );
};

const NameCell = ({ width, name }: NameCellProps) => {
  return (
    <EcloreanCell
      width={`${width}px`}
      style={{
        textOverflow: 'ellipsis',
        textWrap: 'nowrap',
      }}
    >
      {name}
    </EcloreanCell>
  );
};

const IconCell = ({ width, icon }: IconCellProps) => {
  return (
    <EcloreanCell
      width={`${width}px`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </EcloreanCell>
  );
};

const ParentCell = ({ width, parent }: ParentCellProps) => {
  return <EcloreanCell width={`${width}px`}>{parent || 'None'}</EcloreanCell>;
};

const ChildrenCell = ({
  width,
  children,
  onChildrenMenu,
}: ChildrenCellProps) => {
  return (
    <EcloreanCell
      width={`${width}px`}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Button
        variant="outlined"
        onClick={onChildrenMenu ? () => onChildrenMenu(children) : () => {}}
        sx={{
          border: 'none',
          width: '100%',
          color: children.length === 0 ? 'gray' : 'primary.main',
        }}
      >
        {children?.length || 0}
      </Button>
    </EcloreanCell>
  );
};

const TemplateCell = ({ width, templateId }: TemplateCellProps) => {
  return <EcloreanCell width={`${width}px`}>{templateId ?? '-'}</EcloreanCell>;
};

export {
  CheckCell,
  NameCell,
  IconCell,
  ParentCell,
  ChildrenCell,
  TemplateCell,
};
