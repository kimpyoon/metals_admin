export function filterPersonType (value) {
  if (value === 1) {
    return '在职人员'
  } else if (value === 2) {
    return '自由职业者'
  } else if (value === 3) {
    return '退休人员'
  } else if (value === 4) {
    return '在校学生'
  } else {
    return '学龄前儿童'
  }
}
