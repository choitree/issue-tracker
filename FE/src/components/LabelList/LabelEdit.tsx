import styled from 'styled-components';
import { FaSyncAlt } from 'react-icons/fa';
import PrimaryButton from '../../components/Common/PrimaryButton';
import AddIcon from '@material-ui/icons/Add';
import CloseICon from '@material-ui/icons/Close';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ILabel } from '../../pages/LabelListPage';

interface IlabelTitle {
  color: string;
  bgColor: string;
}

interface IinputContainer {
  fit: boolean;
}

interface ILabelEdit {
  headerText: string;
  toggleEdit: boolean;
  setToggleEdit: Dispatch<SetStateAction<boolean>>;
  data?: ILabel;
  getLabels: () => Promise<void>;
}

const getRandomHexColor = ():string => {
  return '#' + Array(6).fill(0).map(_ => Math.floor(Math.random() * 16).toString(16)).join('');
}

export const LabelEdit = ({
  headerText,
  toggleEdit,
  setToggleEdit,
  data,
  getLabels,
}: ILabelEdit) => {
  const [editState, setEditState] = useState(
    data || {
      title: '',
      description: '',
      color: '#000',
      bgColor: '#ffffff',
    },
  );

  const handleBgColor = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setEditState({
      ...editState,
      bgColor: target.value,
    });
  };

  const setRandomBgColor = () => {
    const random = getRandomHexColor();
    setEditState({
      ...editState,
      bgColor: random,
    });
  };

  const handleColor = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setEditState({
      ...editState,
      color: target.value,
    });
  };

  const handleTitle = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setEditState({
      ...editState,
      title: target.value,
    });
  };

  const handleDescription = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setEditState({
      ...editState,
      description: target.value,
    });
  };

  const onHandleLabel = async () => {
    try {
      const result = await fetch(
        `http://ec2-52-79-56-138.ap-northeast-2.compute.amazonaws.com/api/label${
          data ? '/' + data.labelId : ''
        }`,
        {
          method: data ? 'PUT' : 'POST',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editState),
        },
      );
      if(result.status === 200) getLabels();
    } catch (e) {
      console.error(e);
    } finally {
      setToggleEdit(false);
    }
  };

  useEffect(() => {
    setEditState(
      () =>
        data || {
          title: '',
          description: '',
          color: '#000000',
          bgColor: '#FFFFFF',
        },
    );
  }, [toggleEdit]);

  if (!toggleEdit) return null;
  return (
    <StyleLabelEdit inList={!!data}>
      <StyleEditHead>{headerText}</StyleEditHead>
      <StyleEditBody>
        <StyleLabelTitle color={editState.color} bgColor={editState.bgColor}>
          {editState.title}
        </StyleLabelTitle>
        <StyleLabelInputs>
          <StyleLabelInput fit={false}>
            <div>
              <input
                type="text"
                placeholder="레이블 이름"
                value={editState.title}
                onChange={(e) => handleTitle(e)}
              />
            </div>
          </StyleLabelInput>
          <StyleLabelInput fit={false}>
            <div>
              <input
                type="text"
                placeholder="설명(선택)"
                value={editState.description}
                onChange={(e) => handleDescription(e)}
              />
            </div>
          </StyleLabelInput>
          <StyleLabelInput fit={true}>
            <div>
              <span>배경 색상</span>
              <input
                type="text"
                value={editState.bgColor}
                onChange={(e) => handleBgColor(e)}
              />
              <button onClick={setRandomBgColor}>
                <FaSyncAlt />
              </button>
            </div>
            <div>
              <span>텍스트 색상</span>
              <label>
                <input
                  type="radio"
                  name="color"
                  value="#000000"
                  onChange={(e) => handleColor(e)}
                  checked={data ? data.color === '#000000' : true}
                />
                어두운 색
              </label>
              <label>
                <input
                  type="radio"
                  name="color"
                  value="#FFFFFF"
                  onChange={(e) => handleColor(e)}
                  checked={data && data.color === '#FFFFFF'}
                />
                밝은 색
              </label>
            </div>
          </StyleLabelInput>
        </StyleLabelInputs>
      </StyleEditBody>
      <StyleEditButtonWrap>
        <AddButtonLayout btnStyle="small" onClick={onHandleLabel}>
          <AddIcon />
          완료
        </AddButtonLayout>
        <CancelButtonLayout
          btnStyle="small"
          onClick={() => setToggleEdit(false)}
        >
          <CloseICon />
          취소
        </CancelButtonLayout>
      </StyleEditButtonWrap>
    </StyleLabelEdit>
  );
};

const StyleLabelEdit = styled.li<{ inList: boolean }>`
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  border: 1px solid #d9dbe9;
  ${(props) =>
    props.inList
    ? `
        border-radius: 0;
        margin-bottom: 0;
        border: none;
        border-bottom: 1px solid #D9DBE9;
      ` 
    : ''
  }
  background-color: #fff;
  position: relative;
`;

const StyleEditHead = styled.div`
  font-size: 1.5rem;
`;

const StyleEditBody = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3fr;
  & > *:first-child {
    justify-self: center;
  }
`;

const StyleLabelTitle = styled.div<IlabelTitle>`
  padding: 0.25rem 1rem;
  border-radius: 1.875rem;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgColor};
  width: fit-content;
`;

const StyleLabelInputs = styled.ul`
  input {
    width: 100%;
    border: none;
    font-size: 1rem;
    background-color: transparent;
    padding: 0.75rem 1.5rem;
    &::placeholder {
      color: #A0A3BD;
    }
  }
  `;
  
  const StyleLabelInput = styled.li<IinputContainer>`
  display: ${({ fit }) => fit ? 'flex' : 'block'};
  column-gap: 1rem;
  & > div {
    border-radius: 0.75rem;
    background-color: #EFF0F6;
    display: inline-block;
    width: ${({ fit }) => fit ? 'fit-content' : '100%'};
    margin-bottom: 1rem;
    ${({ fit }) => fit ? `
      display: flex;
      align-items: center;
      input {
        width: auto;
        max-width: 7rem;
        padding: 0 1rem;
      }
      padding: 0.75rem 1.5rem;
      label {
        margin: 0 1rem;
      }
    ` : ''}
    span {
      color: #A0A3BD;
      margin-right: 1rem;
    }
    button {
      border: 0;
      background-color: transparent;
      padding: 0 0.5rem;
      cursor: pointer;
    }
  }
`;

const StyleEditButtonWrap = styled.div`
  display: flex;
  flex-direction: row-reverse;
  column-gap: 1rem;
`

const AddButtonLayout = styled(PrimaryButton)`
  height: 2.5rem;
  border-radius: 0.25rem;
`;

const CancelButtonLayout = styled(PrimaryButton)`
  height: 2.5rem;
  border-radius: 0.25rem;
  color: #007AFF;
  background-color: #fff;
  border: 1px solid #007AFF;
  &:hover {
    color: #fff;
    background-color: #007AFF;
  }
`;