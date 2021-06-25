import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { TIssueListFilterType } from 'util/reference';
import { TFilterSelection } from 'util/store';
import CircleCheckBox from './CircleCheckBox';
import Modal from './Modal';

interface IListItemImgType {
  // color: labelColor | image: userImage | text: onlyText (noCheckbox)
  imgType?: 'color' | 'image' | 'text';
  imgUrl?: string;
  color?: string;
}

export interface ICommonListModal {
  rightPos?: string;
  topPos?: string;
  data?: TIssueListFilterType;
}

interface IListModal extends ICommonListModal {
  handleCheckboxClick?: (e: React.MouseEvent | Event) => void;
  selectionState: TFilterSelection;
}

const ListModal = ({ rightPos, topPos, data, handleCheckboxClick, selectionState, ...props }: IListModal) => {
  // 1. 일반
  const { title, items, type } = data!;

  const renderItems = useCallback(
    () =>
      items.map(({ id, imgType, name, text, color, imgUrl }) => (
        <MenuLabelTag key={id}>
          <MenuTextBlock>
            {imgType !== 'text' && (color || imgUrl) && (
              <MenuImageBlock imgType={imgType} color={color} imgUrl={imgUrl} />
            )}
            {text || name}
          </MenuTextBlock>
          {imgType !== 'text' && (
            <CircleCheckBox
              color="default"
              id={`${id}`}
              name={name}
              onClick={handleCheckboxClick}
              checked={selectionState[type].includes(id)}
            />
          )}
        </MenuLabelTag>
      )),
    [items, selectionState],
  );

  return (
    <ListModalLayout {...props} rightPos={rightPos} topPos={topPos}>
      {/* Title */}
      <ListModalRow type="title">
        <MenuTitle>{title}</MenuTitle>
      </ListModalRow>

      {/* Menu Item - html: label tag */}
      <ListModalRow type="items">{renderItems()}</ListModalRow>
    </ListModalLayout>
  );
};

export default ListModal;

// --- Styled Components ---
// 1. 메인 (큰 틀)
const ListModalLayout = styled(Modal)<{ rightPos?: string, topPos?: string }>`
  position: absolute;
  z-index: 99;

  flex-direction: column;
  font-size: 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};

  right: ${({ rightPos }) => (rightPos ? rightPos : 'auto')};
  top: ${({ topPos }) => (topPos ? topPos : '0.2rem')};
`;

const ListModalRow = styled.div<{ type: 'title' | 'items' }>`
  min-width: 14rem;
  display: flex;
  flex-direction: column;

  border-radius: ${({ type }) =>
    type === 'title' ? `0.6rem 0.6rem 0 0` : `0 0 0.6rem 0.6rem`};
  background-color: ${({ type, theme }) =>
    type === 'title'
      ? theme.colors.grayScale.bgColor
      : theme.colors.grayScale.offWhite};
`;
// =====

// 2. 일반
const cssFlexMenu = css`
  display: flex;
  align-items: center;
  padding: 0.65rem 0.5rem;
`;

// title
const MenuTitle = styled.p`
  ${cssFlexMenu};
  font-size: 0.95rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.grayScale.title};
  user-select: none;
`;

// item - html: label tag
const MenuLabelTag = styled.label`
  ${cssFlexMenu};
  cursor: pointer;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  color: ${({ theme }) => theme.colors.grayScale.body};
`;

const MenuTextBlock = styled.span`
  display: flex;
  align-items: center;
  column-gap: 0.2rem;
  user-select: none;
  font-size: 0.9rem;
`;

const MenuImageBlock = styled.div<IListItemImgType>`
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};

  ${({ imgType, imgUrl }) =>
    imgType === 'image' &&
    css`
      min-width: 1.2rem;
      min-height: 1.2rem;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url(${imgUrl});
    `}

  ${({ imgType, color }) =>
    imgType === 'color' &&
    css`
      min-width: 1rem;
      min-height: 1rem;
      background-color: ${color};
    `}
`;
