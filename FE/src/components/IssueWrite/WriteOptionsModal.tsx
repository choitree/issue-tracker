import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { TFilterSelection, writeDataAtom } from 'util/store';

import ListModal, { ICommonListModal } from 'components/Common/ListModal';

const WriteOptionsModal = ({ rightPos, topPos, data, ...props }: ICommonListModal) => {
  // 1. 일반
  const { type } = data!;

  const [writeDataState, setWrtieDataState] = useRecoilState(writeDataAtom); // assignees, labels, milestone
  const [writeOptionsSelection, setWriteOptionsSelection] =
    useState<TFilterSelection>({ assignee: [], search: [], label: [], milestone: [], writer: [] });

  const [arrCurrChecked, setArrCurrChecked] = useState<number[]>([]);
  const [isCheckboxUpdate, setIsCheckboxUpdate] = useState(false);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  // 2. useEffect
  // 1) writeDataState에 확정 / ListFilterModal과는 다르게 동작
  useEffect(() => {
    //writeDateState 확인하고 writeOptionsSelection에 넣기
    const { assignees, labels, milestone } = writeDataState;
    setWriteOptionsSelection({
      ...writeOptionsSelection,
      assignee: assignees,
      label: labels,
      milestone: milestone ? [milestone] : [],
    });
  }, []);
  useEffect(
    () => {
      firstLoading
        ? setFirstLoading(false)
        : setWriteOptionsSelection({...writeOptionsSelection, [type]: arrCurrChecked})
    }, [arrCurrChecked]);
  useEffect(() => {
    if (!isCheckboxUpdate) return;
    const { assignee, label, milestone } = writeOptionsSelection;
    setWrtieDataState({
      ...writeDataState,
      assignees: assignee,
      milestone: milestone.length > 0 ? milestone[0] : -1,
      labels: label,
    })
    setIsCheckboxUpdate(false);
  }, [writeOptionsSelection]);

  // 3. events (IssueWrite) -=------------작성해야 (WriteFooter 주석도 제거요망)
  const handleCheckboxClick = (e: React.MouseEvent | Event) => {
    const target = e.target as HTMLInputElement;

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

  return (
    <ListModal
      rightPos={rightPos}
      topPos={topPos}
      selectionState={writeOptionsSelection}
      data={data}
      handleCheckboxClick={handleCheckboxClick}
      {...props}
    />
  );
};

export default WriteOptionsModal;
