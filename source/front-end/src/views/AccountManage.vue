<template>
	<div>
		<CCard class="card-base">
			<CCardBody>
				<h4 style="color: #98a8a0">
					<CIcon name="cil-people" size="lg" /> 帳號管理
				</h4>
				<hr class="mt-0 mb-2" />


				<CCol lg="12">
				<CButton
					style="float: right;color: #2C9430"
					variant="outline"
					color="success"
					class="mr-2 mb-4"
					@click="show_model('新增')"
					><CIcon name="cil-user-plus" /> 新增</CButton
				>
				</CCol>
		

			<CDataTable
				:items="items"
				:fields="fields"
				style="textalign: center; font-size: 125%; color: #d686bc"
				:items-per-page="15"
				:bordered="true"
				sorter
				pagination
			>
				<template #show_details="{ item }">
				<td class="p-2">
					<CButton
						square
						size="sm"
						style="color: #609485"
						@click="show_model('修改資料', item)"
					>
						<CIcon size="xl" name="cil-pencil" />
					</CButton>
					<CButton
						square
						size="sm"
						style="color: #C2B07E"
						@click="show_model('修改密碼', item)"
					>
						<CIcon size="xl" name="cil-lock-locked" />
					</CButton>
					<!-- <CButton
						square
						size="sm"
						style="color: #e55353"
						@click="delete_account(item.account)"
						v-if="item.role!='admin'"
					>
						<CIcon size="xl" name="cil-trash" />
					</CButton> -->
				</td>
				</template>
			</CDataTable>

			<CModal
				size="lg"
				:show.sync="showInsertModal"
				:closeOnBackdrop="false"
			>
				<CRow>
				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="帳號:" v-model="account" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="密碼:" v-model="password" type="password" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="姓名:" v-model="name" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="工號:" v-model="jobNumber" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CSelect
					label="部門:"
					:options="departmentOptions"
					:value.sync="dept"
					@change="select_department('department', dept)"
					/>
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CSelect
					label="權限:"
					:options="roleOptions"
					:value.sync="role"
					/>
				</CCol>
				<CCol lg="3" />
				</CRow>

				<template #header>
				<h3 class="modal-title">新增使用者</h3>
				<CButtonClose @click="showInsertModal = false" class="text-white" />
				</template>
				<template #footer>
				<CButton @click="insert_account()" color="success">新增</CButton>
				<CButton @click="showInsertModal = false" color="dark">返回</CButton
				>
				</template>
			</CModal>

			<CModal
				size="lg"
				:show.sync="showUpdateModal"
				:closeOnBackdrop="false"
			>
				<CRow>
				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="帳號:" v-model="account" disabled />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="姓名:" v-model="name" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="工號:" v-model="jobNumber" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CSelect
					label="部門:"
					:options="departmentOptions"
					:value.sync="dept"
					@change="select_department('department', dept)"
					/>
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CSelect
					label="權限:"
					:options="roleOptions"
					:value.sync="role"
					/>
				</CCol>
				<CCol lg="3" />
				</CRow>

				<template #header>
				<h3 class="modal-title">更新使用者資料</h3>
				<CButtonClose @click="showUpdateModal = false" class="text-white" />
				</template>
				<template #footer>
				<CButton @click="update_account()" color="success">更新</CButton>
				<CButton @click="showUpdateModal = false" color="dark">返回</CButton
				>
				</template>
			</CModal>

			<CModal
				class="modal-am"
				size="lg"
				:show.sync="showUpdatePasswordModal"
				:closeOnBackdrop="false"
			>
				<CRow>
				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="帳號:" v-model="updateAccount" disabled />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput label="密碼:" v-model="newPassword" type="password" />
				</CCol>
				<CCol lg="3" />

				<CCol lg="3" />
				<CCol lg="6">
					<CInput
					label="確認密碼:"
					v-model="checkPassword"
					type="password"
					/>
				</CCol>
				<CCol lg="3" />
				</CRow>

				<template #header>
				<h3 class="modal-title">更新密碼</h3>
				<CButtonClose
					@click="showUpdatePasswordModal = false"
					class="text-white"
				/>
				</template>
				<template #footer>
				<CButton @click="update_password()" color="success">更新</CButton>
				<CButton @click="showUpdatePasswordModal = false" color="dark">返回</CButton
				>
				</template>
			</CModal>
			</CCardBody>
		</CCard>
	</div>
</template>

<script>
export default {
	data: () => {
		return {
			department: [],
			departmentOptions: [],
			level: [],
			showDepartmentModal: false,

			items: [],
			fields: [
				{ key: "account", label: "帳號", _style: "width:17%; color: #4C756A" },
				{ key: "name", label: "姓名", _style: "width:17%; color: #4C756A" },
				{ key: "job_number", label: "工號", _style: "width:17%; color: #4C756A" },
				{ key: "dept", label: "部門", _style: "width:17%; color: #4C756A" },
				{ key: "role", label: "權限", _style: "width:17%; color: #4C756A" },
				{ key: "show_details", label: "", _style: "width:15%; color: #4C756A" },
			],

			showInsertModal: false,
			showUpdateModal: false,
			showUpdatePasswordModal: false,

			account: "",
			password: "",
			name: "",
			jobNumber: "",
			dept: "",
			role: "",
			roleOptions: ["guest", "user", "admin"],

			updateAccount: "",
			updateName: "",
			updateJobNumber: "",
			updateDept: "",
			updateRole: "",

			updatePassword: "",

			newPassword: "",
			checkPassword: "",
		};
	},

	created() {
		this.reset();
	},

	methods:{
		show_model(source,item){
            if (source === '修改資料') {
                this.account     = item.account
                this.name        = item.name
                this.jobNumber   = item.job_number
                this.dept        = item.dept
                this.role        = item.role

                this.updateAccount     = item.account
                this.updateName        = item.name
                this.updateJobNumber   = item.job_number
                this.updateDept        = item.dept
                this.updateRole        = item.role

                this.showUpdateModal = true
            }
            if (source === '修改密碼') {
                this.updateAccount      = item.account
                this.newPassword        = ''
                this.checkPassword      = ''

                this.showUpdatePasswordModal = true
            }
            if (source === '新增') {
                this.account     = ''
                this.password    = ''
                this.name        = ''
                this.jobNumber   = ''
                this.dept        = ''
                this.role        = 'guest'

                this.showInsertModal = true
            }
        },

        insert_account(){
            if (!this.account)   return alert('請輸入帳號')
            if (!this.password)  return alert('請輸入密碼')
            if (!this.name)      return alert('請輸入姓名')

            for (let i = 0 ; i < this.items.length ; ++i){
                if (this.items[i].account === this.account){
                    this.account = ''
                    alert('請勿使用已重複的帳號')
                    return
                }
                if (this.items[i].name === this.name){
                    this.name = ''
                    alert('請勿使用已重複的姓名')
                    return
                }
            }

            let data = {
                account:this.account,
                password:this.password,
                name:this.name,
                job_number:this.jobNumber,
                dept:this.dept,
                role:this.role
            }
            this.$http
                .post('/api/accounts/insert_accounts',{data:data})
                .then(res => {
                    if (res.status === 201){
                        this.reset()
                    } else {
                        alert('傳入值出現非預期狀況，請確認後再進行操作!')
                    }
                })
                .catch(err => {
                    alert('發生錯誤!')
                    this.showInsertModal = false
                    console.log(err)
                })
        },

        update_account(){
            if (    this.name       === this.updateName         &&
                    this.jobNumber  === this.updateJobNumber    &&
                    this.dept       === this.updateDept         &&
                    this.role       === this.updateRole
            ){
                return alert('請修改資料後，再進行更新操作!')
            }

            if (!this.name) return alert('請輸入姓名')

            for (let i = 0 ; i < this.items.length ; ++i){
                if (this.items[i].name === this.name && this.name != this.updateName){
                    this.name = ''
                    alert('請勿使用已重複的姓名')
                    return
                }
            }

            let data = {
                account:this.account,
                name:this.name,
                job_number:this.jobNumber,
                dept:this.dept,
                role:this.role
            }
            this.$http
                .patch('/api/accounts/update_accounts',{data:data})
                .then(res => {
                    if (res.status === 202){
                        this.reset()
                    } else {
                        alert('傳入值出現非預期狀況，請確認後再進行操作!')
                    }
                })
                .catch(err => {
                    alert('發生錯誤!')
                    this.showUpdateModal = false
                    console.log(err)
                })
        },

        update_password(){
            if (!(this.newPassword) || !(this.checkPassword)) return alert('請輸入密碼!')

            if (this.newPassword !== this.checkPassword) {
                this.checkPassword  = ''
                return alert('確認密碼失敗，請重新輸入!')
            }

            let data = {
                password:this.newPassword,
                account:this.updateAccount
            }
            this.$http
                .patch('/api/accounts/update_password',{data:data})
                .then(res => {
                    if (res.status === 202){
                        this.reset()
                    } else {
                        alert('傳入值出現非預期狀況，請確認後再進行操作!')
                    }
                })
                .catch(err => {
                    alert('發生錯誤!')
                    this.showUpdatePasswordModal = false
                    console.log(err)
                })
        },

        delete_account(account){
            if (confirm('確認刪除此設定嗎?')){
                let data = {
                    account:account
                }
                this.$http
                    .post('/api/accounts/delete_accounts',{data:data})
                    .then(res => {
                        if (res.status === 203){
                            this.reset()
                        } else {
                            alert('傳入值出現非預期狀況，請確認後再進行操作!')
                        }
                    })
                    .catch(err => {
                        alert('發生錯誤!')
                        console.log(err)
                    })
            }
        },

        reset(){
            this.showInsertModal         = false
            this.showUpdateModal         = false
            this.showUpdatePasswordModal = false

            this.items = []

            this.$http
                .get('/api/accounts/select_accounts')
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i]
                        // systex為系統最高權限 隱藏
                        if (result.account      === 'systex')   continue
                        if (result.job_number   === null)       result.job_number   = ''
                        if (result.dept         === null)       result.dept         = ''
                        this.items.push(result)
                    }
                })
                .catch(err => {
                    this.reset()
                    console.log(err)
                })
        }
	},
};
</script>

<style scope>
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
	color: white;
}
.table {
    color: white;
}
.modal-am {
	color: whte;
}
</style>