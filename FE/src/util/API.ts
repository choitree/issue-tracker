// POSTMAN: https://documenter.getpostman.com/view/8052286/TzY7cDPK

// AWS API: http://ec2-52-79-56-138.ap-northeast-2.compute.amazonaws.com
// AWS API: http://ec2-3-38-47-96.ap-northeast-2.compute.amazonaws.com  // 변경 (2021.08.29)


type TRequestTypes = 'users' | 'issues' | 'issue' | 'milestones' | 'milestone' | 'labels' | 'label' ;
type TGetRequestRequiredPaths = { [type in TRequestTypes]: boolean };

const getRequestRequiredPaths: TGetRequestRequiredPaths = {
  users: false,
  issues: false,
  issue: true,  // id
  milestones: false,
  milestone: true,  // id
  labels: false,
  label: false,  // id (false, 전체 허용)
};

const END_POINT: string =
  'http://ec2-3-38-47-96.ap-northeast-2.compute.amazonaws.com';

const createGetRequestAddress = (
  type: TRequestTypes,
  strPath: string = '',
): string => {
  try {
    let result = `${END_POINT}/api/${type}`;
    if (getRequestRequiredPaths[type] && !strPath)
      throw new Error('Error: Please enter an additional url path..');
    else result += strPath;
    return result;
  } catch (e) {
    const { message } = e as Error;
    console.error(message);
    return '';
  }
};

const createRequestAddress = (type: TRequestTypes): string => `${END_POINT}/api/${type}`;

export { END_POINT, createGetRequestAddress, createRequestAddress };
