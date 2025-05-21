const FormRoutes = [
  {
    path: '/forms',
    name: 'forms',
    // @ts-ignore
    component: () => import('../../modules/forms/views/FormView.vue')
  },
  {
    path: '/forms/new',
    name: 'new_form',
   // @ts-ignore
    component: () => import('../../modules/forms/views/FormCreateUpdate.vue')
  }

]

export default FormRoutes;