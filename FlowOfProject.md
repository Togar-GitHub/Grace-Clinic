Script for Grace Clinic Capstone, presented to App Academy

List of seed users:
1.	Staff = username, password, position
  a.	Position Staff:
    i.	‘johndoe’, ‘passjohndoe’, staff	= as Demo Staff
    ii.	‘bobbrown’, ‘passbobbrown’, staff
  b.	Position Doctor:
    i.	‘janesmith’, ‘passjanesmith’, doctor = as Demo Doctor
    ii.	‘emmadavis’, passemmadavis’, doctor
  c.	Position Manager:
    i.	‘alicejohnson, ‘passalicejohnson’, manager = as Demo Manager
2.	Patient = username, password, date of birth
  a.	‘michaeltaylor’, ‘passmichaeltaylor’, dob: 03-22-2000 = as Demo Patient
  b.	‘sophiamartinez’, ‘passsophiamartinez’, dob: 06-14-2002
  c.	‘davidwilson’, ‘passdavidwilson’, dob: 05-11-1999
  d.	‘oliviaanderson’, ‘passoliviaanderson’, dob: 08-18-1997
  e.	‘jamesgarcia’, ‘passjamesgarcia’, dob: 04-10-1988

Landing Page:
  1.	Click on the logo, will always bring back to Landing Page (home)
  2.	Main page shows information:
    a.	Who we are = We are here for You
    b.	List of Services
    c.	Acceptable Insurances
    d.	Top 5 Reviews
    e.	Link to Review Page => full CRUD Review table
      i.	Only patients can go here
      ii.	Can create, update and delete reviews
  3.	Far right icon, will have drop down for:
    a.	Login
    b.	Signup
    c.	ManageUser – to update the user data
      i.	For Staff – need manager approval (username & password)
    d.	Logout
  4.	On the top information and links
    a.	Login information:
      i.	Name, Username, Email
      ii.	If staff = Position
    b.	Links:
      i.	Patient: Appointment
      ii.	Staff: Chart List
      iii.	Doctor & Manager: Chart List and Admin Page

Appointment Page:
  1.	Patients can make new appointments:
    a.	Require choosing a doctor
    b.	Require choosing the date and time
    c.	Require entering a complaint
    d.	Insurance is not required
    e.	Any combination of doctor, date and time conflict will show errors
  2.	Any future appointment date
    a.	Ability to Update
    b.	Ability to Delete
    3.	Shows passed appointment list
    4.	Full CRUD on Appointment table

Chart List Page:
  1.	Need to enter firstname, lastname and date of birth to get the list of Charts
  2.	Will show the list of charts
    a.	Any staff (including non-attending doctor) can do update, but only for Insurance and next Appointment
    b.	For attending doctor, can delete the Charts, and this will trigger the Appointment dateMet to be nulled, hence can re-create a new Chart
    c.	For attending doctor, can update the chart with all the fields that necessary
    d.	The top part of the update chart information is coming from Appointment table, hence it can’t be updated.

Admin Page:
  1.	Create New Chart = only for attending doctor
  2.	Maintain Patient User
  3.	Maintain Staff User
  4.	Maintain CPT Code Table
  5.	Maintain Service Table

Create Chart Table
  1.	Need to enter firstname, lastname and date of birth to get the list of Appointments belongs to the patient with the doctor as the attending doctor.
  2.	Upon Create Chart: need to enter all necessary information.
  3.	Full CRUD on Chart Table (with Chart List Page on Read, Update and Delete

Admin Patient User Page:
  1.	List of Patients
  2.	Patients can’t be deleted unless the inactive Date is more than 5 years
    a.	Update Inactive date – can enter any passed date
    b.	Once there is any inactive date, the patient can’t login anymore
    c.	To activate, just delete the Inactive Date and update it
    d.	Any Inactive Date of more than 5 years, will have a Delete Button to delete
    e.	Patient deletion will trigger the deletion of Charts, Appointments and Reviews that belong to that specific patient

Admin Staff User Page:
  1.	The of Staff with Delete Staff button
  2.	The User can’t delete his or her own User record
  3.	Any Staff (usually only doctor) can’t be deleted if they still have relation to any Chart
  4.	Full CRUD on User Table (including the Admin Patient User, Signup Modal and Manage User modal)

Admin CPT Table Page:
  1.	This is a table with CPT Code that will be chosen or updated in the Chart
  2.	Can Update and Delete
  3.	Can’t be deleted if the code has relationship with the Chart
  4.	Full CRUD on CPT table

Admin Service Table Page:
  1.	This is a table on Service that will be used in the Chart and shown in the Landing page
  2.	Can Update and Delete
  3.	Can’t be deleted if the code has relationship with the Chart
  4.	Full CRUD on Service Table


Additional information:

Number of tables for this Capstone:
  1.	User table (full CRUD)
  2.	Review table (full CRUD)
  3.	CPT table (full CRUD)
  4.	Service table (full CRUD)
  5.	Appointment table (full CRUD)
  6.	Chart table (full CRUD)

Footer: links to LinkedIn and GitHub


Thank you,
Togar Mamora
