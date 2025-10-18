@startuml
package "Presentation Layer" {
  class UserManagementComponent {
    - users: UserDto[]
    - users: UserDto[]
    - isLoading: boolean
    - error: string | null
    + fetchUsers(): Promise<void>
    + fetchDepartments(): Promise<void>
    + handleCreateUser(userData: CreateUserDto): Promise<void>
    + handleUpdateUser(userId: number, userData: UpdateUserDto): Promise<void>
    + handleDeleteUser(userId: number): Promise<void>
  }
}

package "Business Layer" {
  interface UserService {
    + getUsers(): Promise<UserDto[]>
    + createUser(userData: CreateUserDto): Promise<UserDto>
    + updateUser(userId: number, userData: UpdateUserDto): Promise<UserDto>
    + deleteUser(userId: number): Promise<void>
  }
}

package "Data Layer" {
  interface UserRepository {
    + findAll(): Promise<UserEntity[]>
    + findById(id: number): Promise<UserEntity | null>
    + create(user: CreateUserEntity): Promise<UserEntity>
    + update(id: number, user: UpdateUserEntity): Promise<UserEntity>
    + delete(id: number): Promise<void>
  }
  
  class UserEntity {
    - id: number
    - name: string
    - email: string
    - phoneNumber: string
    - position: PositionEnum
    - departmentId: number
    - createdAt: Date
    - updatedAt: Date
  }
}

package "DTO Layer" {
  class UserDto {
    + id: number
    + fullName: string
    + email: string
    + phone: string
    + position: string
    + departmentName: string
  }
  
  class CreateUserDto {
    + fullName: string
    + email: string
    + phone: string
    + position: PositionEnum
    + departmentId: number
  }
}

UserManagementComponent --> UserService : depends on
UserService --> UserRepository : depends on
UserRepository --> UserEntity : manages
UserService --> UserDto : returns
UserService --> CreateUserDto : accepts

note right of UserManagementComponent
يمثل مكون React المسؤول عن:
- عرض واجهة المستخدم
- إدارة حالة الواجهة
- التعامل مع أحداث المستخدم
end note

note right of UserService
يمثل طبقة الخدمات المسؤولة عن:
- منطق الأعمال
- التحقق من الصحة
- معالجة الأخطاء
end note
@enduml