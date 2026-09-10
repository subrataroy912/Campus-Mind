/**
 * API transport contracts. These typedefs intentionally mirror Majorproject's
 * JSON, rather than UI/domain objects. ISO timestamps are strings.
 * @typedef {'TEACHER'|'STUDENT'|'ADMIN'} AccountType
 * @typedef {'PUBLIC'|'PRIVATE'} Visibility
 * @typedef {'ASSIGNMENT'|'ANNOUNCEMENT'|'MATERIAL'} CourseworkType
 * @typedef {'DRAFT'|'PUBLISHED'|'ARCHIVED'} CourseworkStatus
 * @typedef {'DRAFT'|'TURNED_IN'|'RETURNED'|'GRADED'|'MISSING'} SubmissionStatus
 * @template T
 * @typedef {{content:T[],page:number,size:number,totalElements:number,totalPages:number,first:boolean,last:boolean}} PageResponse
 * @typedef {{accessToken:string,refreshToken:string,userId:string,email:string,displayName:string,avatarUrl:string|null}} AuthResponse
 * @typedef {{id:string,ownerId:string,title:string,section:string,subject:string,description:string,coverUrl:string|null,visibility:Visibility,status:'ACTIVE'|'ARCHIVED',enrollmentEnabled:boolean,enrollmentCode:string,createdAt:string,updatedAt:string}} CourseResponse
 * @typedef {{id:string,courseId:string,creatorId:string,type:CourseworkType,title:string,description:string,status:CourseworkStatus,publishedAt:string|null,dueAt:string|null,maximumPoints:number|null,createdAt:string,updatedAt:string}} CourseworkResponse
 * @typedef {{id:string,courseworkId:string,courseId:string,studentId:string,status:SubmissionStatus,answerText:string|null,submittedAt:string|null,returnedAt:string|null,late:boolean,score:number|null,graderId:string|null,feedback:string|null,gradedAt:string|null}} SubmissionResponse
 * @typedef {{error:string}} ApiErrorResponse
 */
export {};
