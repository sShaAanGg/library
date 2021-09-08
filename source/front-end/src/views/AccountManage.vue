<template>
	<div class="fullpage">
	<CCard class="card-1">
		<CCardBody>
		<h4 style="color: #d686bc">
			<CIcon name="cil-people" size="lg" /> 帳號管理
		</h4>
		<hr class="mt-0 mb-2" />

		<CRow class="pt-2">
			<CCol lg="12">
			<CButton
				style="float: right"
				variant="outline"
				color="info"
				class="mr-2 mb-4"
				@click="show_model('新增')"
				><CIcon name="cil-user-plus" /> 新增</CButton
			>
			</CCol>
		</CRow>

		<CDataTable
			:items="items"
			:fields="fields"
			style="textalign: center; font-size: 125%; color: #d686bc"
			:items-per-page="15"
			:bordered="true"
			column-filter
			sorter
			pagination
		>
			<template #show_details="{ item }">
			<td class="p-2">
				<CButton
				square
				size="sm"
				style="color: #2eb85c"
				@click="show_model('修改資料', item)"
				>
				<CIcon size="xl" name="cil-pencil" />
				</CButton>
				<CButton
				square
				size="sm"
				style="color: #321fdb"
				@click="show_model('修改密碼', item)"
				>
				<CIcon size="xl" name="cil-lock-locked" />
				</CButton>
				<CButton
				square
				size="sm"
				style="color: #e55353"
				@click="delete_account(item.account)"
				>
				<CIcon size="xl" name="cil-trash" />
				</CButton>
			</td>
			</template>
		</CDataTable>

		<CModal
			size="lg"
			color="info"
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

			<CCol lg="1" />
			<CCol lg="10">
				<CCard>
				<CCardBody>
					<CRow>
					<CCol lg="3" v-for="item in level" :key="item.index">
						<h5>{{ item.department }}</h5>
						<input
						type="checkbox"
						v-model="item.status"
						:value="item.status"
						style="zoom: 3"
						/>
					</CCol>
					</CRow>
				</CCardBody>
				</CCard>
			</CCol>
			<CCol lg="1" />

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
			<CButton @click="insert_account()" color="info">新增</CButton>
			<CButton @click="showInsertModal = false" color="danger"
				>返回</CButton
			>
			</template>
		</CModal>

		<CModal
			size="lg"
			color="success"
			:show.sync="showDepartmentModal"
			:closeOnBackdrop="false"
		>
			<CRow>
			<CCol lg="3">
				<CSelect
				label="部門:"
				:options="departmentOptions"
				:value.sync="dept"
				@change="select_department('department', dept)"
				/>
				<CButton
				variant="outline"
				color="success"
				class="mr-1 mb-4"
				@click="save_department(dept)"
				><CIcon size="xl" name="cil-save"
				/></CButton>
				<CButton
				variant="outline"
				color="primary"
				class="mr-1 mb-4"
				@click="add_department(dept)"
				><CIcon size="xl" name="cil-plus"
				/></CButton>
				<CButton
				variant="outline"
				color="danger"
				class="mr-1 mb-4"
				@click="delete_department(dept)"
				><CIcon size="xl" name="cil-trash"
				/></CButton>
			</CCol>
			<CCol lg="9">
				<CCard>
				<CCardBody>
					<CRow>
					<CCol lg="3" v-for="item in level" :key="item.index">
						<h5>{{ item.department }}</h5>
						<input
						type="checkbox"
						v-model="item.status"
						:value="item.status"
						style="zoom: 3"
						/>
					</CCol>
					</CRow>
				</CCardBody>
				</CCard>
			</CCol>
			</CRow>

			<template #header>
			<h3 class="modal-title">管理部門</h3>
			<CButtonClose
				@click="showDepartmentModal = false"
				class="text-white"
			/>
			</template>
			<template #footer>
			<CButton @click="showDepartmentModal = false" color="danger"
				>返回</CButton
			>
			</template>
		</CModal>

		<CModal
			size="lg"
			color="success"
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

			<CCol lg="1" />
			<CCol lg="10">
				<CCard>
				<CCardBody>
					<CRow>
					<CCol lg="3" v-for="item in level" :key="item.index">
						<h5>{{ item.department }}</h5>
						<input
						type="checkbox"
						v-model="item.status"
						:value="item.status"
						style="zoom: 3"
						/>
					</CCol>
					</CRow>
				</CCardBody>
				</CCard>
			</CCol>
			<CCol lg="1" />

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
			<CButton @click="showUpdateModal = false" color="danger"
				>返回</CButton
			>
			</template>
		</CModal>

		<CModal
			size="lg"
			color="primary"
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
			<CButton @click="update_password()" color="primary">更新</CButton>
			<CButton @click="showUpdatePasswordModal = false" color="danger"
				>返回</CButton
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
		{ key: "account", label: "帳號", _style: "width:17%; color: #7da8d3" },
		{ key: "name", label: "姓名", _style: "width:17%; color: #7da8d3" },
		{ key: "job_number", label: "工號", _style: "width:17%; color: #7da8d3" },
		{ key: "dept", label: "部門", _style: "width:17%; color: #7da8d3" },
		{ key: "role", label: "權限", _style: "width:17%; color: #7da8d3" },
		{ key: "show_details", label: "", _style: "width:15%; color: #7da8d3" },
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

};
</script>

<style scope>
/* .background {
	background-color: #272727;
}
.card-1 {
	background-color:#000000;
	border-color: #272727;
	color: #d686bc;
}
.fullpage {
	border-color: #272727;
	color: #7da8d3
} */
</style>