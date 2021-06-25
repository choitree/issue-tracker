import { useEffect, useState } from 'react';
import { TTextIssueListFilterItems } from 'util/reference';
import { IAllGetRequestDatas } from 'util/types';
import {
  createAllFilterItems,
  createLabelsFilterItems,
  createMilestonesFilterItems,
  createUsersFilterItems,
} from 'util/util';

function useCreateFilterItems(data?: IAllGetRequestDatas, filterType: "filter" | "writeOptions" = 'filter') {
  const [issueFilterItems, setIssueFilterItems] = useState<TTextIssueListFilterItems>();

  useEffect(() => {
    if (!data) return;

    const { labels, users, milestones } = data;
    if (!labels || !users || !milestones) return;

    const usersFilterItems = createUsersFilterItems(users.users);
    const milestonesFilterItems = createMilestonesFilterItems(
      milestones.milestones,
    );
    const labelsFilterItems = createLabelsFilterItems(labels.labels);
    const filterItems = createAllFilterItems({
      labelsFilterItems,
      usersFilterItems,
      milestonesFilterItems,
    }, filterType);

    setIssueFilterItems(filterItems);
  }, [data]);


  return issueFilterItems;
}

export default useCreateFilterItems;
