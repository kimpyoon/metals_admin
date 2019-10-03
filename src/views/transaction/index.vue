<template>
  <div>

  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate.js'
import { formatDateTime } from '@/utils/formatDateTime.js'
import { getToken } from '@/utils/auth'
export default {
  data () {
    return {

    }
  },
  filters: {
    dateFilter (val) {
      return formatDate(new Date(val))
    },
    dateTimeFilter (val) {
      return formatDateTime(new Date(val))
    }
  },
  mounted () {

  },
  methods: {
    getToken: getToken,
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'single-row'
      } else {
        return ''
      }
    },
    tableCellClassName ({ column, columnIndex }) {
      if (columnIndex === 0) {
        return 'firstCell'
      }
    },
    tableHeaderRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'firstRow'
      }
    },
    formateTime (row, column) {
      const date = new Date(row.createTime)
      return formatDate(date)
    }
  }
}
</script>
<style scoped lang="stylus" src="@/static/css/pagination.styl"></style>
<style scoped lang="stylus">

</style>
