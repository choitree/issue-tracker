import styled from 'styled-components';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import PrimaryButton from '../components/Common/PrimaryButton';
import AddIcon from '@material-ui/icons/Add';
import CloseICon from '@material-ui/icons/Close';
import { useEffect, useState } from 'react';
import { LabelEdit } from '../components/LabelList/LabelEdit';
import { createGetRequestAddress } from 'util/API';

interface ILabelTitle {
  color: string;
  bgColor: string;
}

export interface ILabel {
  labelId: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  editor?: boolean;
}

const LabelListPage = () => {

  const [labels, setLabels] = useState([] as ILabel[]);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [toggleNewEditor, setToggleNewEditor] = useState(false);

  const getLabels = async () => {
    const data = await fetch(
      createGetRequestAddress('labels'),
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      },
    );
    const json: { labels: ILabel[] } = await data.json();
    if (data.status === 200) {
      const labelData = json.labels;
      setLabels(labelData);
    }
  };

  const onToggleEditor = (label:ILabel) => {
    const tmpLabels = labels.map(v => {
      const tmpLabel = {...v};
      if (tmpLabel.labelId === label.labelId) {
        tmpLabel.editor = true;
      } else {
        tmpLabel.editor = false;
      }
      return tmpLabel;
    });
    setLabels(tmpLabels);
    setToggleEdit(true);
  }

  const deleteLabel = async (labelId:number) => {
    try {
      const result = await fetch(
        createGetRequestAddress('label', `/${labelId}`),
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        },
      );
      if(result.status === 200) {
        const tmpLabels = labels.map((v) => ({ ...v }));
        setLabels(tmpLabels.filter(v => v.labelId !== labelId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (labels.length === 0) {
      getLabels();
    }
  }, []);

  const labelsComponent:JSX.Element[] = [];
  labels.forEach(label => {
    labelsComponent.push(
      <StyleLabelItem key={label.labelId}>
        <StyleLabelTitle color={label.color} bgColor={label['bgColor']}>
          {label.title}
        </StyleLabelTitle>
        <StyleLabelDescription>{label.description}</StyleLabelDescription>
        <StyleLabelButtons>
          <StyleLabelEditButton onClick={() => onToggleEditor(label)}>
            <FaEdit />
            편집
          </StyleLabelEditButton>
          <StlyeLabelDeleteButton onClick={() => deleteLabel(label.labelId)}>
            <FaTrashAlt />
            삭제
          </StlyeLabelDeleteButton>
        </StyleLabelButtons>
      </StyleLabelItem>,
    );
    if(label.editor) {
      labelsComponent.push(
        <LabelEdit
          key={'e' + label.labelId}
          setToggleEdit={setToggleEdit}
          toggleEdit={toggleEdit}
          headerText="레이블 편집"
          data={label}
          getLabels={getLabels}
        />
      );
    }
  });
  return (
    <StyleLabelListContainer>
      <LabelListHeader>
        {/* 레이블 / 마일스톤 버튼 넣을 공간 */}
        <div></div>
        <AddButtonLayout
          btnStyle="small"
          onClick={() => setToggleNewEditor(!toggleNewEditor)}
        >
          {toggleNewEditor ? <CloseICon /> : <AddIcon />}
          {toggleNewEditor ? '닫기' : '추가'}
        </AddButtonLayout>
      </LabelListHeader>
      {toggleNewEditor && (
        <ul>
          <LabelEdit
            setToggleEdit={setToggleNewEditor}
            toggleEdit={toggleNewEditor}
            headerText="새로운 레이블 추가"
            getLabels={getLabels}
          />
        </ul>
      )}
      <StyleLabelList>
        <li>{labels.length}개의 레이블</li>
        {labelsComponent}
      </StyleLabelList>
    </StyleLabelListContainer>
  );
}

const StyleLabelListContainer = styled.div`
  padding-bottom: 5rem;
`

const LabelListHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
`;

const AddButtonLayout = styled(PrimaryButton)`
  height: 100%;
  a {
    display: flex;
    color: #fff;
    text-decoration: none;
  }
  padding: 0.5rem;
  width: 8rem;
  justify-content: center;
`;

const StyleLabelList = styled.ul`
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  & > li:first-child {
    padding: 1.125rem 2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  }
`;

const StyleLabelItem = styled.li`
  display: grid;
  align-items: center;
  padding: 2.25rem 2rem;
  background-color: #FEFEFE;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  grid-template-columns: 1fr 5fr 1fr;
  &:last-child {
    border-bottom: none;
  }
`;

const StyleLabelTitle = styled.div<ILabelTitle>`
  padding: 0.25rem 1rem;
  border-radius: 1.875rem;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgColor};
  width: fit-content;
`;

const StyleLabelDescription = styled.div`
  color: ${({ theme }) => theme.colors.grayScale.label};
  font-size: 1rem;
`;

const StyleLabelButtons = styled.div`
  text-align: right;
`;

const StyleLabelEditButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  svg {
    vertical-align: top;
    font-size: 1rem;
    margin-right: 0.25rem;
  }
`;

const StlyeLabelDeleteButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.normal.red};
  svg {
    vertical-align: top;
    font-size: 1rem;
    margin-right: 0.25rem;
  }
`;

export default LabelListPage;
