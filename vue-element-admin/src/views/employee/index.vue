<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-input v-model="params.empName" placeholder="姓名" clearable style="width: 70%" />
      </el-col>
      <el-col :span="4">
        <el-select v-model="params.deptName" placeholder="部门" clearable>
          <el-option
            v-for="item in deptNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="params.empDegreeName" placeholder="学历" clearable>
          <el-option
            v-for="item in empDegreeNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-edit" @click="add">新增</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column align="center" label="姓名">
        <template slot-scope="{row}">
          <span>{{ row.empName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="{row}">
          <span>{{ dataScreening(row.sex, sexList) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄">
        <template slot-scope="{row}">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门名称">
        <template slot-scope="{row}">
          <span>{{ dataScreening(row.deptName, deptNameList) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学历">
        <template slot-scope="{row}">
          <span>{{ dataScreening(row.empDegreeName, empDegreeNameList) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编 辑</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="form.empName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别" clearable style="width: 100%">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" clearable />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-select v-model="form.deptName" placeholder="请选择部门名称" clearable style="width: 100%">
            <el-option
              v-for="item in deptNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学历" prop="empDegreeName">
          <el-select v-model="form.empDegreeName" placeholder="请选择学历" clearable style="width: 100%">
            <el-option
              v-for="item in empDegreeNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      list: [],
      params: {
        empName: '',
        deptName: '',
        empDegreeName: ''
      },
      form: {
        empName: '',
        sex: '',
        age: '',
        deptName: '',
        empDegreeName: ''
      },
      sexList: [
        { value: '0', label: '男' },
        { value: '1', label: '女' }
      ],
      deptNameList: [
        { value: '1', label: '业务部' },
        { value: '2', label: '人事部' },
        { value: '3', label: '后勤部' }
      ],
      empDegreeNameList: [
        { value: '1', label: '大专' },
        { value: '2', label: '本科' },
        { value: '3', label: '研究生' }
      ],
      rules: {
        empName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择部门名称', trigger: 'change' }
        ],
        empDegreeName: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询员工数据
    getList() {
      axios.get('http://localhost:8080/list', {
        params: this.params
      }).then(response => {
        this.list = response.data
      })
    },
    // 新增
    add() {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 修改
    edit(row) {
      this.form = row
      this.dialogVisible = true
      this.isEdit = true
    },
    // 清空新增或修改数据
    clear() {
      this.form = {
        empName: '',
        sex: '',
        age: '',
        deptName: '',
        empDegreeName: ''
      }
    },
    // 新增或修改员工信息
    confirm() {
      // 判断当前是不是修改
      if (this.isEdit) {
        axios.post('http://localhost:8080/edit', this.form).then(response => {
          if (response.data) {
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.getList()
          }
        })
      } else {
        axios.post('http://localhost:8080/add', this.form).then(response => {
          if (response.data) {
            this.$message.success('新增成功')
            this.dialogVisible = false
            this.getList()
          }
        })
      }
      this.clear()
    },
    remove(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('http://localhost:8080/remove', {
          params: { id: row.id }
        }).then(response => {
          if (response.data) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    // 筛选数组数据
    dataScreening(index, list) {
      // 根据条件过滤具体信息
      const data = list.filter(item => item.value === index)
      if (data === undefined || data === 'undefined' || data.length === 0) {
        return ''
      }
      return data[0].label
    },
    // 导出
    exportData() {
      const tableData = [
        ['姓名', '性别', '年龄', '部门名称', '学历'] // 导出表头
      ]
      this.list.forEach((item) => {
        let rowData = []
        // 导出内容的字段
        rowData = [
          item.empName,
          this.dataScreening(item.sex, this.sexList),
          item.age,
          this.dataScreening(item.deptName, this.deptNameList),
          this.dataScreening(item.empDegreeName, this.empDegreeNameList)
        ]
        tableData.push(rowData)
      })
      const workSheet = XLSX.utils.aoa_to_sheet(tableData)
      const bookNew = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(bookNew, workSheet, '职工列表信息') // 工作簿名称
      const name = '职工列表.xlsx'
      XLSX.writeFile(bookNew, name) // 保存的文件名
    }
  }
}
</script>
