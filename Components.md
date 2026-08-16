All Reusable Components those will need: 
1. App/Layout Components

AppShell

AuthLayout

DashboardLayout

ClassroomLayout

ChatLayout

PageContainer

PageHeader

PageTitle

PageContent

Sidebar

SidebarItem

TopNavbar

MobileNavbar

Breadcrumbs

BottomNavigation

ContentGrid


2. Navigation Components

NavigationMenu

NavigationItem

UserMenu

UserMenuItem

ClassNavigation

ClassTabNavigation

MobileMenu

BackButton

SearchButton


3. Authentication Components

LoginForm

RegisterForm

ForgotPasswordForm

ResetPasswordForm

AuthForm

AuthInput

PasswordInput

PasswordVisibilityToggle

RememberMe

AuthHeader

AuthFooter

ProtectedRoute

RoleGuard


4. User Components

UserAvatar

UserAvatarGroup

UserName

UserRoleBadge

UserCard

UserList

UserListItem

UserProfileCard

ProfileHeader

ProfileDetails

ProfileForm


5. Common UI Components

Button

IconButton

Input

Textarea

Select

Checkbox

Radio

Switch

FormField

FormError

Label

Card

Modal

Drawer

Dropdown

Tooltip

Popover

Tabs

Badge

Avatar

Divider

Skeleton

Spinner

ProgressBar

EmptyState

ErrorState

LoadingState

ConfirmationDialog

Toast

ToastContainer


6. Dashboard Components

DashboardHeader

WelcomeSection

DashboardStats

StatCard

RecentClasses

ClassGrid

ClassCard

RecentAssignments

AssignmentSummaryCard

RecentAnnouncements

ActivityFeed

UpcomingDeadlines

QuickActions


7. Classroom Components

Your specification includes creating, editing, deleting, joining and managing classes. 

ClassCard

ClassGrid

ClassHeader

ClassBanner

ClassInfo

ClassCode

ClassCodeDisplay

ClassCodeCopyButton

CreateClassForm

EditClassForm

JoinClassForm

ClassSettings

ClassActions

ClassMembers

ClassMemberList

ClassMemberCard

TeacherCard

StudentCard

MemberRoleBadge


8. Class Stream Components

ClassStream

StreamHeader

AnnouncementCard

AnnouncementList

AnnouncementComposer

AnnouncementForm

PostActions

PostMenu

PostAttachment

PostTimestamp


9. Study Material Components

The platform supports uploading and accessing study materials.  

MaterialList

MaterialCard

MaterialItem

MaterialUpload

MaterialUploadForm

MaterialPreview

MaterialViewer

MaterialActions

FileIcon

FilePreview

FileDownloadButton

FileAttachment

FileSize

FileTypeBadge


10. Assignment Components

AssignmentList

AssignmentCard

AssignmentItem

AssignmentHeader

AssignmentDetails

AssignmentDescription

AssignmentDeadline

AssignmentStatus

AssignmentStatusBadge

AssignmentActions

CreateAssignmentForm

EditAssignmentForm

AssignmentInstructions

AssignmentAttachment


11. Submission Components

SubmissionForm

SubmissionUploader

SubmissionFileList

SubmissionFile

SubmissionPreview

SubmissionStatus

SubmissionStatusBadge

SubmissionDetails

SubmissionHistory

SubmitButton

ResubmitButton


12. Grading Components

GradeCard

GradeDisplay

GradeBadge

GradeInput

GradeForm

FeedbackForm

FeedbackDisplay

SubmissionReview

SubmissionReviewHeader

StudentGradeRow

GradeList

-----------

13. Chat Components

Chat is one of the major feature areas, including real-time messaging, direct chat and class group chat. 

Chat Shell

ChatWindow

ChatHeader

ChatSidebar

ConversationList

ConversationItem

ConversationSearch


Messages

MessageList

Message

MessageBubble

MessageGroup

MessageSender

MessageTimestamp

MessageStatus

UnreadMessageIndicator


Composer

MessageComposer

MessageInput

SendMessageButton

AttachmentButton

EmojiButton

AttachmentPreview


Real-Time Status

OnlineStatus

TypingIndicator

ReadReceipt

UnreadBadge


Chat Attachments

ChatAttachment

ChatFilePreview

ChatImagePreview

ChatFileDownload


14. Notification Components


NotificationBell

NotificationBadge

NotificationDropdown

NotificationList

NotificationItem

NotificationIcon

NotificationTimestamp

NotificationGroup

MarkAsReadButton

MarkAllAsReadButton


15. File Upload Components

FileUploader

FileDropzone

FileInput

FileList

FileItem

FilePreview

FileProgress

FileUploadProgress

FileRemoveButton

FileDownloadButton

FileTypeIcon

UploadError


16. Search Components

SearchBar

SearchInput

SearchButton

SearchResults

SearchResultItem

SearchEmptyState

SearchFilters

SearchFilter


17. Feedback & System Components

SuccessMessage

ErrorMessage

WarningMessage

InfoMessage

LoadingSpinner

PageLoader

SkeletonCard

SkeletonList

EmptyState

ErrorPage

NotFoundPage

OfflineIndicator


18. Responsive Components


ResponsiveContainer

ResponsiveGrid

MobileSidebar

MobileHeader

MobileBottomNav

MobileClassCard

MobileChat

MobileFileUploader

ResponsiveModal



---

Recommended Folder Structure

Instead of putting 150+ components into one folder, organize them by responsibility:

src/
└── components/
    │
    ├── ui/
    │   ├── Button
    │   ├── Input
    │   ├── Modal
    │   ├── Card
    │   ├── Badge
    │   └── ...
    │
    ├── layout/
    │   ├── AppShell
    │   ├── Sidebar
    │   ├── Navbar
    │   └── ...
    │
    ├── auth/
    │   ├── LoginForm
    │   ├── RegisterForm
    │   └── ...
    │
    ├── classroom/
    │   ├── ClassCard
    │   ├── ClassHeader
    │   ├── ClassMembers
    │   └── ...
    │
    ├── assignment/
    │   ├── AssignmentCard
    │   ├── AssignmentForm
    │   ├── SubmissionForm
    │   └── ...
    │
    ├── grading/
    │   ├── GradeCard
    │   ├── GradeForm
    │   └── ...
    │
    ├── chat/
    │   ├── ChatWindow
    │   ├── ConversationList
    │   ├── MessageBubble
    │   └── ...
    │
    ├── materials/
    │   ├── MaterialCard
    │   ├── MaterialUpload
    │   └── ...
    │
    ├── notifications/
    │   ├── NotificationBell
    │   ├── NotificationList
    │   └── ...
    │
    ├── users/
    │   ├── UserAvatar
    │   ├── UserCard
    │   └── ...
    │
    └── files/
        ├── FileUploader
        ├── FilePreview
        └── ...

