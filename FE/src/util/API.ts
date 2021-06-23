// POSTMAN: https://documenter.getpostman.com/view/8052286/TzY7cDPK
// AWS API: http://ec2-52-79-56-138.ap-northeast-2.compute.amazonaws.com

type TGetRequestTypes = 'users' | 'issues' | 'issue' | 'milestones' | 'milestone' | 'labels' | 'label' ;
type TGetRequestRequiredPaths = { [type in TGetRequestTypes]: boolean };

const getRequestRequiredPaths: TGetRequestRequiredPaths = {
  users: false,
  issues: false,
  issue: true,  // id
  milestones: false,
  milestone: true,  // id
  labels: false,
  label: true,  // id
};

const END_POINT: string =
  'http://ec2-52-79-56-138.ap-northeast-2.compute.amazonaws.com';

const createGetRequestAddress = (
  type: TGetRequestTypes,
  strPath: string = '',
): string => {
  try {
    let result = `${END_POINT}/api/${type}`;
    if (getRequestRequiredPaths[type] && !strPath)
      throw new Error('Error: Please enter an additional url path..');
    else result += strPath;
    return result;
  } catch (e) {
    console.error(e.message);
    return '';
  }
};

export { END_POINT, createGetRequestAddress };
