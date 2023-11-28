/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const EmployeeRouter = {
  path: '/employee',
  component: Layout,
  redirect: '/employee/employee',
  alwaysShow: true,
  name: 'Employee',
  meta: { title: '职工管理', icon: 'zip' },
  children: [
    {
      path: 'employees',
      component: () => import('@/views/employee/index'),
      name: 'Employees',
      meta: { title: '职工列表' }
    }
  ]
}
export default EmployeeRouter
