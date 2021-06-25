import styled from 'styled-components';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useCreateFilterItems, useRefreshUserState } from 'util/hooks';
import { writeDataAtom, writeOptionsVisibleAtom } from 'util/store/issueWrite';
import { IIssueWriteChildren } from '.';
import { FaPlus } from 'react-icons/fa';
import WriteOptionsModal from './WriteOptionsModal';

const WriteBody = ({ data, handleWriteOptionsModalClick, ...props }: IIssueWriteChildren) => {
  // 1. 일반 (Recoil 등..)
  const { refreshUserDataState } = useRefreshUserState();
  const [writeDataState, setWrtieDataState] = useRecoilState(writeDataAtom);
  const writeOptionsVisibleState = useRecoilValue(writeOptionsVisibleAtom);
  // 필터 (WriteFilterModal (생성해야함) )에 들어가는 데이터 생성
  const issueWriteFilterItems = useCreateFilterItems(data, 'writeOptions');

  // 2. useEffect
  useEffect(() => {
    const authorId = Number(refreshUserDataState.id);
    setWrtieDataState({ ...writeDataState, authorId });
  }, [refreshUserDataState]);

  // 3. events
  const handleWriteChange = (e: React.ChangeEvent) => {
    const { name, value } = e.currentTarget as HTMLTextAreaElement | HTMLInputElement;
    setWrtieDataState({ ...writeDataState, [name]: value });
  };

  return (
    <WriteBodyLayout {...props}>
      <AvatarImage src={refreshUserDataState.profileImage} />
      <IssueWriteBlock>
        <input
          type="text"
          name="title"
          placeholder="제목"
          onChange={handleWriteChange}
        />
        <div>
          <textarea name="contents" onChange={handleWriteChange} />
          <span>코멘트를 입력하세요</span>
        </div>
      </IssueWriteBlock>
      {issueWriteFilterItems && (
        <IssueWriteSideList>
          <li>
            <p>담당자</p>
            <button id="modalBtn" onClick={() => handleWriteOptionsModalClick("assignee")}><FaPlus /></button>
            {writeOptionsVisibleState.assignee && (<WriteOptionsModal rightPos="0" topPos="3.6rem" data={issueWriteFilterItems['assignee']} />)}
          </li>
          <li>
            <p>레이블</p>
            <button id="modalBtn" onClick={() => handleWriteOptionsModalClick("label")}><FaPlus /></button>
            {writeOptionsVisibleState.label && (<WriteOptionsModal rightPos="0" topPos="3.6rem" data={issueWriteFilterItems['label']} />)}
          </li>
          <li>
            <p>마일스톤</p>
            <button id="modalBtn" onClick={() => handleWriteOptionsModalClick("milestone")}><FaPlus /></button>
            {writeOptionsVisibleState.milestone && (<WriteOptionsModal rightPos="0" topPos="3.6rem" data={issueWriteFilterItems['milestone']} /> )}
          </li>
        </IssueWriteSideList>
      )}
    </WriteBodyLayout>
  );
};

export default WriteBody;

// --- Styled Components ---
// 1. 최상위 Layout
const WriteBodyLayout = styled.div`
  display: grid;
  grid-template-columns: 2.75rem 4.4fr 1.5fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
`;

// 1) 작성자 이미지
const AvatarImage = styled.img`
  width: 100%;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};
`;

// 2. 작성폼 & 작성폼 사이드 리스트
// 1) 작성폼
const IssueWriteBlock = styled.div`
  padding: 0 1rem;
  div {
    position: relative;
  }
  input {
    background-color: #eff0f6;
    font-size: 1rem;
    color: #333;
    padding: 0.875rem 1.5rem;
    border-radius: 1rem;
    width: 100%;
    margin-bottom: 1rem;
    border-color: transparent;
    font-weight: 400;
    &::placeholder {
      color: #a0a3bd;
    }
  }
  textarea {
    padding: 0.875rem 1.5rem;
    padding-top: 2.5rem;
    background-color: #eff0f6;
    margin-bottom: 2rem;
    font-size: 1rem;
    border-radius: 1rem;
    min-height: 16rem;
    width: 100%;
    resize: vertical;
    border: none;
    position: relative;
    &:focus {
      background-color: #fff;
      box-shadow: 0px 0px 1px #000;
    }
  }
  span {
    position: absolute;
    font-size: 1rem;
    color: #a0a3bd;
    top: 1rem;
    left: 1.5rem;
    transition: transform 0.2s linear, left 0.2s linear;
  }
  textarea:focus + span {
    transform: scale(0.75);
    left: 0.5rem;
  }
`;

// 2) 작성폼 사이드 리스트
const IssueWriteSideList = styled.ul`
  color: ${({ theme }) => theme.colors.grayScale.label};
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  border-radius: 1rem;
  background-color: #fff;
  height: fit-content;
  li {
    position: relative;
    color: ${({ theme }) => theme.colors.grayScale.label};
    padding: 1.8rem;
    display: grid;
    grid-template-columns: auto 1.8rem;
    align-items: center;
    font-weight: 700;
  }
  li:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  }
  button {
    background-color: #fff;
    border: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.grayScale.label};
    padding: 0.2rem 0.5rem;
    cursor: pointer;
  }
`;