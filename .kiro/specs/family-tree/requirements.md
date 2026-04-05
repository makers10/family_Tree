# Requirements Document

## Introduction

A full-generational family tree builder that allows users to create and manage family trees, add people with photos and biographical information, define relationships (parent-child, spouse, sibling), visualize the tree interactively, and collaborate with others through a branch contribution system. The application uses Supabase for authentication and data persistence, Cloudinary for image storage, and React with react-flow for the frontend visualization.

## Glossary

- **System**: The Family Tree Application as a whole
- **Auth_Service**: The Supabase Auth module handling user registration, login, and session management
- **People_Service**: The backend service responsible for creating, reading, updating, and deleting person records
- **Relationship_Service**: The backend service responsible for managing relationships between people
- **Tree_Service**: The backend service responsible for managing family tree records and membership
- **Contributor_Service**: The backend service responsible for managing tree contributor roles and branch permissions
- **Photo_Service**: The Cloudinary-backed service responsible for uploading and storing profile photos
- **Visualizer**: The react-flow + dagre-based frontend component that renders the family tree graph
- **Person**: A record representing an individual in the family tree, containing personal details and an optional photo
- **Relationship**: A record linking two Person records with a typed association (parent_child, spouse, or sibling)
- **Family_Tree**: A named collection of Person records owned by a user, with public or private visibility
- **Tree_Member**: A join record associating a Person with a Family_Tree
- **Contributor**: A user granted access to a Family_Tree with a specific role (owner, editor, or viewer) and an optional branch root person
- **Branch**: The subset of a Family_Tree reachable from a designated branch_root_person_id
- **RLS**: Row-Level Security policies enforced by Supabase Postgres to restrict data access per user
- **Circular_Relationship**: A relationship chain that would cause a person to be their own ancestor or descendant

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a visitor, I want to register and log in with my email and password, so that I can securely access and manage my family trees.

#### Acceptance Criteria

1. THE Auth_Service SHALL support user registration with a unique email address and a password of at least 8 characters.
2. WHEN a user submits valid registration credentials, THE Auth_Service SHALL create a new account and issue a session token.
3. IF a user submits a registration email that already exists, THEN THE Auth_Service SHALL return an error indicating the email is already in use.
4. WHEN a user submits valid login credentials, THE Auth_Service SHALL issue a session token valid for 1 hour.
5. IF a user submits invalid login credentials, THEN THE Auth_Service SHALL return an authentication error without revealing which field is incorrect.
6. WHEN a session token expires, THE Auth_Service SHALL require the user to re-authenticate before accessing protected resources.
7. WHEN a user logs out, THE Auth_Service SHALL invalidate the current session token.

---

### Requirement 2: Person Management

**User Story:** As an authenticated user, I want to create, view, update, and delete person records, so that I can build and maintain the individuals in my family tree.

#### Acceptance Criteria

1. THE People_Service SHALL store the following fields for each Person: full_name (required), birth_date (optional), death_date (optional), bio (optional), gender (optional), photo_url (optional), and created_by (the authenticated user's ID).
2. WHEN an authenticated user submits a valid person creation request, THE People_Service SHALL create a Person record and return the new record's ID.
3. IF a person creation request omits the full_name field, THEN THE People_Service SHALL return a validation error.
4. WHEN an authenticated user requests a Person record, THE People_Service SHALL return the full Person record if RLS permits access.
5. WHEN an authenticated user submits a valid person update request, THE People_Service SHALL update only the fields provided in the request.
6. IF a person update sets death_date to a date earlier than birth_date, THEN THE People_Service SHALL return a validation error.
7. WHEN an authenticated user deletes a Person record, THE People_Service SHALL remove the Person and all associated Relationship records referencing that Person.
8. THE People_Service SHALL enforce RLS so that only the record's created_by user or a Contributor with editor or owner role on the associated Family_Tree can modify the Person record.

---

### Requirement 3: Profile Photo Upload

**User Story:** As an authenticated user, I want to upload a profile photo for a person, so that the family tree displays recognizable images alongside each individual.

#### Acceptance Criteria

1. WHEN an authenticated user uploads an image file for a Person, THE Photo_Service SHALL upload the file to Cloudinary and return a publicly accessible photo_url.
2. THE Photo_Service SHALL accept image files in JPEG, PNG, and WebP formats only.
3. IF an uploaded file exceeds 5 MB, THEN THE Photo_Service SHALL reject the upload and return a file-size error.
4. IF an uploaded file is not a supported image format, THEN THE Photo_Service SHALL reject the upload and return a format error.
5. WHEN a photo upload succeeds, THE People_Service SHALL update the Person record's photo_url with the URL returned by the Photo_Service.
6. WHEN a Person record is deleted, THE Photo_Service SHALL delete the associated Cloudinary asset if a photo_url exists.

---

### Requirement 4: Relationship Management

**User Story:** As an authenticated user, I want to define parent-child, spouse, and sibling relationships between people, so that the family tree accurately reflects family structure.

#### Acceptance Criteria

1. THE Relationship_Service SHALL support three relationship types: parent_child, spouse, and sibling.
2. WHEN an authenticated user creates a relationship between Person A and Person B, THE Relationship_Service SHALL store the relationship with the specified type, is_biological flag, and optional married_on and divorced_on dates.
3. IF a relationship creation request specifies a parent_child relationship that would create a Circular_Relationship, THEN THE Relationship_Service SHALL reject the request and return a circular-relationship error.
4. IF a relationship creation request specifies married_on and divorced_on dates where divorced_on is earlier than married_on, THEN THE Relationship_Service SHALL return a validation error.
5. THE Relationship_Service SHALL allow a Person to have multiple spouse relationships simultaneously to support polygamous family structures.
6. WHEN an authenticated user deletes a Relationship record, THE Relationship_Service SHALL remove only that Relationship record without affecting the associated Person records.
7. THE Relationship_Service SHALL enforce RLS so that only Contributors with editor or owner role on the associated Family_Tree can create or delete Relationship records.
8. WHEN a Relationship record is created or updated, THE Relationship_Service SHALL verify that both Person A and Person B are members of the same Family_Tree.

---

### Requirement 5: Circular Relationship Prevention

**User Story:** As an authenticated user, I want the system to prevent circular ancestry chains, so that the family tree remains logically consistent.

#### Acceptance Criteria

1. WHEN a parent_child relationship creation is requested, THE Relationship_Service SHALL traverse the existing parent_child graph to determine whether the proposed relationship would make Person A a descendant of Person B or Person B a descendant of Person A.
2. IF the traversal in criterion 1 detects a cycle, THEN THE Relationship_Service SHALL reject the relationship and return an error identifying the conflicting persons.
3. THE Relationship_Service SHALL complete the circular-relationship check within 2 seconds for trees containing up to 10,000 Person records.
4. WHEN a sibling or spouse relationship is created, THE Relationship_Service SHALL skip the circular-relationship traversal as cycles are only possible through parent_child links.

---

### Requirement 6: Family Tree Management

**User Story:** As an authenticated user, I want to create and manage named family trees, so that I can organize people into distinct family groups.

#### Acceptance Criteria

1. WHEN an authenticated user creates a Family_Tree, THE Tree_Service SHALL store the tree with a name, the user's ID as owner_id, and an is_public flag defaulting to false.
2. THE Tree_Service SHALL enforce that each Family_Tree name is unique per owner.
3. WHEN an authenticated user adds a Person to a Family_Tree, THE Tree_Service SHALL create a Tree_Member record linking the Person to the Family_Tree.
4. IF a Person is already a member of the specified Family_Tree, THEN THE Tree_Service SHALL return an error indicating the person is already a member.
5. WHEN an authenticated user removes a Person from a Family_Tree, THE Tree_Service SHALL delete the Tree_Member record and all Relationship records that reference that Person within the same Family_Tree.
6. WHEN an authenticated user sets a Family_Tree's is_public flag to true, THE Tree_Service SHALL allow unauthenticated users to read the tree and its members in read-only mode.
7. WHEN an authenticated user deletes a Family_Tree, THE Tree_Service SHALL delete all associated Tree_Member, Contributor, and Relationship records for that tree.
8. THE Tree_Service SHALL enforce RLS so that only the owner can delete or change the is_public flag of a Family_Tree.

---

### Requirement 7: Branch Contributor System

**User Story:** As a tree owner, I want to invite other users as contributors with specific roles and optional branch restrictions, so that collaborators can edit only the parts of the tree they are responsible for.

#### Acceptance Criteria

1. THE Contributor_Service SHALL support three contributor roles: owner, editor, and viewer.
2. WHEN a tree owner invites a user to a Family_Tree, THE Contributor_Service SHALL create a Contributor record with the specified role and an optional branch_root_person_id.
3. WHERE a Contributor record has a branch_root_person_id set, THE Contributor_Service SHALL restrict that contributor's write access to Person and Relationship records within the Branch rooted at branch_root_person_id.
4. WHILE a user holds the viewer role on a Family_Tree, THE System SHALL allow that user to read all Person and Relationship records in the tree but SHALL reject any write operations.
5. WHILE a user holds the editor role on a Family_Tree without a branch_root_person_id, THE System SHALL allow that user to create, update, and delete Person and Relationship records anywhere in the tree.
6. IF an editor with a branch_root_person_id attempts to modify a Person or Relationship outside their assigned Branch, THEN THE System SHALL reject the operation and return a permission error.
7. WHEN a tree owner removes a Contributor record, THE Contributor_Service SHALL delete the record and revoke the user's access to the Family_Tree immediately.
8. THE Contributor_Service SHALL enforce RLS so that only the tree owner can create, update, or delete Contributor records for a given Family_Tree.

---

### Requirement 8: Tree Visualization

**User Story:** As an authenticated user, I want to view an interactive graph of my family tree, so that I can explore generational relationships visually.

#### Acceptance Criteria

1. WHEN an authenticated user opens a Family_Tree, THE Visualizer SHALL render all Person nodes and Relationship edges using a dagre hierarchical layout.
2. THE Visualizer SHALL display each Person node with the person's full_name and photo_url thumbnail (or a placeholder avatar if no photo exists).
3. WHEN a user clicks a Person node, THE Visualizer SHALL display a detail panel showing the Person's full_name, birth_date, death_date, bio, gender, and photo.
4. THE Visualizer SHALL visually distinguish parent_child, spouse, and sibling edges using distinct line styles or colors.
5. WHEN the Family_Tree contains more than 50 Person nodes, THE Visualizer SHALL render the initial view centered on the tree owner's associated Person node.
6. THE Visualizer SHALL support pan and zoom interactions so that users can navigate large trees.
7. WHEN a Person node is added or a Relationship is created, THE Visualizer SHALL update the graph layout without requiring a full page reload.
8. IF the Family_Tree contains no Person records, THEN THE Visualizer SHALL display an empty-state prompt guiding the user to add the first person.

---

### Requirement 9: Public Tree Sharing

**User Story:** As a tree owner, I want to share a public link to my family tree, so that people without an account can view it in read-only mode.

#### Acceptance Criteria

1. WHEN a tree owner sets a Family_Tree's is_public flag to true, THE Tree_Service SHALL make the tree accessible via a shareable URL without requiring authentication.
2. WHILE a Family_Tree's is_public flag is true, THE System SHALL allow unauthenticated requests to read Person records, Relationship records, and Tree_Member records for that tree.
3. WHILE a Family_Tree's is_public flag is true, THE System SHALL reject any unauthenticated write operations on that tree's data.
4. WHEN a tree owner sets a Family_Tree's is_public flag to false, THE System SHALL immediately deny unauthenticated read access to that tree's data.
5. THE System SHALL generate a stable, human-readable shareable URL based on the Family_Tree's ID that does not change when the tree name is updated.

---

### Requirement 10: Data Consistency and RLS Enforcement

**User Story:** As a system operator, I want all data access to be governed by Row-Level Security policies, so that users can only access and modify data they are authorized to see.

#### Acceptance Criteria

1. THE System SHALL enforce RLS policies on the people, relationships, family_trees, tree_members, and tree_contributors tables so that no authenticated user can read or write records outside their authorized scope.
2. WHEN a database query is executed without a valid session token, THE System SHALL return no rows from any RLS-protected table.
3. THE System SHALL enforce at the application level that a Person cannot be related to themselves via any Relationship type.
4. THE System SHALL enforce at the application level that duplicate Relationship records (same person_a, person_b, and relationship_type) cannot be created.
5. WHEN a Contributor's branch_root_person_id references a Person who is subsequently removed from the Family_Tree, THE Contributor_Service SHALL set the branch_root_person_id to null and notify the tree owner.

---

### Requirement 11: Complex Relationship Types

**User Story:** As an authenticated user, I want to record extramarital and informal relationships between people, so that the family tree accurately reflects all biological and social connections regardless of marital status.

#### Acceptance Criteria

1. THE Relationship_Service SHALL support a fourth relationship type: extramarital, in addition to parent_child, spouse, and sibling.
2. WHEN an authenticated user creates a relationship with type extramarital between Person A and Person B, THE Relationship_Service SHALL store the record with the extramarital type and apply the same RLS rules as other relationship types.
3. WHEN a child is born from an extramarital relationship, THE Relationship_Service SHALL allow parent_child Relationship records to be created linking the child to both biological parents, regardless of whether a spouse relationship exists between those parents.
4. THE Visualizer SHALL render extramarital relationship edges using a distinct line style and color that differs from spouse relationship edges.
5. WHEN the Visualizer renders a Person node whose parent_child relationships include a parent linked via an extramarital relationship, THE Visualizer SHALL display edges connecting that Person node to both biological parents.
6. IF a relationship creation request specifies the extramarital type for a Person linked to themselves, THEN THE Relationship_Service SHALL return a validation error.
7. THE Relationship_Service SHALL enforce that duplicate Relationship records with the same person_a, person_b, and extramarital type cannot be created.

---

### Requirement 12: Social Media Sharing of Generation Snapshots

**User Story:** As an authenticated user, I want to export and share a visual snapshot of a selected generation or branch of my family tree, so that I can distribute family information through social media platforms.

#### Acceptance Criteria

1. WHEN an authenticated user selects a generation level or a Branch root, THE Visualizer SHALL generate a PNG or JPEG image containing all Person nodes and Relationship edges within that selection, including each person's full_name and photo_url thumbnail.
2. WHEN the image generation completes, THE System SHALL provide share links for Facebook, Twitter/X, and WhatsApp using each platform's URL scheme, and SHALL invoke the Web Share API on supported browsers as the primary sharing mechanism.
3. WHEN the Web Share API is unavailable, THE System SHALL fall back to displaying platform-specific share links and a copy-to-clipboard button for the share URL.
4. WHILE a Family_Tree's is_public flag is false, THE System SHALL require the user to be authenticated before generating or accessing the export image for that tree.
5. WHILE a Family_Tree's is_public flag is true, THE System SHALL allow unauthenticated users to generate and share export images for that tree.
6. IF image generation fails for any reason, THEN THE System SHALL return an error message and SHALL NOT present incomplete or blank images to the user.
7. THE Visualizer SHALL support generation-level selection by allowing the user to specify a generation number, where generation 1 is the root Person node of the Family_Tree.
