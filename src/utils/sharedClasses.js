const classIds = (user) => [
  ...(user?.created_class_ids || user?.createdClassIds || user?.createdCourseIds || []),
  ...(user?.joined_class_ids || user?.joinedClassIds || user?.enrolledCourseIds || []),
];

export function getSharedClassIds(userA, userB) {
  const userBClassIds = new Set(classIds(userB));
  return [...new Set(classIds(userA))].filter((id) => userBClassIds.has(id));
}

export function getSharedClassCount(userA, userB) {
  return getSharedClassIds(userA, userB).length;
}
