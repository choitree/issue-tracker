import ListModal, { ICommonListModal } from 'components/Common/ListModal';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { filterSelectionAtom } from 'util/store/issueList';

const ListFilterModal = ({ rightPos, data, ...props }: ICommonListModal) => {
  // 1. 일반
  const { type } = data!;

  const [filterSelectionState, setFilterSelectionState] = useRecoilState(filterSelectionAtom);
  const [arrCurrChecked, setArrCurrChecked] = useState<number[]>([]);
  const [isCheckboxUpdate, setIsCheckboxUpdate] = useState(false);

  // =========

  // 2. useEffect
  useEffect(() => {
    if (!isCheckboxUpdate) return;
    setFilterSelectionState({
      ...filterSelectionState,
      [type]: arrCurrChecked,
    });
    setIsCheckboxUpdate(false);
  }, [isCheckboxUpdate]);

  // 3. events
  const handleCircleCheckboxClick = (e: React.MouseEvent | Event) => {
    const target = e.target as HTMLInputElement;

    // 현재 ListFilterModal에서 받아온 data.type이 레이블(Label)일 경우에만 동작하는 함수
    const checkboxClickForTypeLabelOrAssignee = (checked: boolean) => {
      if (checked)
        setArrCurrChecked((arrCurrChecked) => {
          let newArr: number[] = [];
          if (arrCurrChecked.includes(-1))
            newArr = [
              ...arrCurrChecked.filter((id) => id !== -1),
              Number(target.id),
            ];
          else
            target.id === '-1'
              ? (newArr = [Number(target.id)])
              : (newArr = arrCurrChecked.concat(Number(target.id)));
          return newArr;
        });
      else
        setArrCurrChecked(
          arrCurrChecked.filter((id) => id !== Number(target.id)),
        );
    };

    if (type === 'label' || type === 'assignee')
      checkboxClickForTypeLabelOrAssignee(target.checked);
    else {
      target.checked
        ? setArrCurrChecked([Number(target.id)])
        : setArrCurrChecked([]);
    }
    setIsCheckboxUpdate(true);
  };

  // =========
  return (
    <ListModal
      rightPos={rightPos}
      selectionState={filterSelectionState}
      data={data}
      handleCheckboxClick={handleCircleCheckboxClick}
      {...props}
    />
  );
};

export default ListFilterModal;
