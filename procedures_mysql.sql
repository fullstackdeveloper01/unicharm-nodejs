DELIMITER //
CREATE procedure ChangePassword
(
	UserCode nvarchar(50),
	BirthYear int
)
BEGIN

	update Employees set Password = (select CAST(right(UUID(),10) AS CHAR(10)))
	where Email = UserCode and YEAR(Birthdate) = BirthYear

	select * from Employees a
	where --a.IsDeleted=0 
	 a.Email = UserCode
	 and YEAR(a.Birthdate) = BirthYear
	--order by ProcessName

END
 //
DELIMITER ;


DELIMITER //
create procedure CreateBackup
(
	name VARCHAR(50),
	path VARCHAR(256) 
)
BEGIN

--DECLARE name VARCHAR(50) -- database name  
--DECLARE path VARCHAR(256) -- path for backup files  
DECLARE fileName VARCHAR(256) -- filename for backup  
DECLARE fileDate VARCHAR(20) -- used for file name

 
---- specify database backup directory
--SET path = XMLData.value('(/XMLData/path)1','nvarchar(MAX)') + '\'
----SET path = 'G:\DB_Backups1\'  
--SET name = XMLData.value('(/XMLData/Dbname)1','nvarchar(MAX)')
 
-- specify filename format
SELECT fileDate = CAST(NOW() AS CHAR(20)) 

 
DECLARE db_cursor CURSOR FOR  
SELECT name 
FROM master.sysdatabases 
Where name = name
--WHERE name NOT IN ('master','model','msdb','tempdb')  -- exclude these databases

 
OPEN db_cursor   
FETCH NEXT FROM db_cursor INTO name   

 
WHILE @FETCH_STATUS = 0   
BEGIN   
       SET fileName = path + name + '_' + fileDate + '.BAK'  
       BACKUP DATABASE name TO DISK = fileName  

 
       FETCH NEXT FROM db_cursor INTO name   
END   

 
CLOSE db_cursor   
DEALLOCATE db_cursor

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE DeleteClaimById
(
	ClaimId BIGINT,
	Category nvarchar(100)
)
BEGIN
	
	declare ExpenseId as bigint

	If Category = 'Corporate'
		BEGIN
			Set ExpenseId = (SELECT /* LIMIT 1 */ A.ExpenseId From EMS_Expense.ClaimMaster A Where A.Id = ClaimId)

			  DELETE FROM EMS_Expense.ExpenseMaster WHERE Id = ExpenseId
			  DELETE FROM EMS_Expense.ClaimMaster WHERE Id = ClaimId
		END
	ELSE
		BEGIN
			Set ExpenseId = (SELECT /* LIMIT 1 */ A.ExpenseId From EMS_Expense.ClaimMasterSales A Where A.Id = ClaimId)

			  DELETE FROM EMS_Expense.ExpenseMasterSales WHERE Id = ExpenseId
			  DELETE FROM EMS_Expense.ClaimMasterSales WHERE Id = ClaimId
		END

	
END
 //
DELIMITER ;


DELIMITER //
CREATE procedure GetRequestForAutoApproved
(
	Id bigint
)
BEGIN

	Select Id, Date, TimeFrom from MeetingDetails 
	where AproveStatus = 'PENDING' and CAST(Date AS CHAR(10)) = CAST(NOW() AS CHAR(10))

END
 //
DELIMITER ;


DELIMITER //
create procedure InsertIntoLoginDetail
(
	LoginId BIGINT,
	UserId bigint,
	LoginDatetime datetime ,
	LogoutDatetime datetime,
	LoginUserType int,
	MACAddress nvarchar(max),
	IPAddress nvarchar(max)
)
BEGIN

	update LoginDetail set IsActive = 0

	insert into LoginDetail (
								UserId ,
								LoginDatetime  ,
								LogoutDatetime ,
								IsActive ,
								LoginUserType,
								MACAddress,
								IPAddress
							)
					values(
								UserId ,
								LoginDatetime  ,
								LogoutDatetime ,
								1 ,
								LoginUserType
								,MACAddress
								,IPAddress
							)			
	set LoginId = (select @IDENTITY)


	select * 
	--, (select b.UserType from UserMaster b where b.UserId = a.UserId) as UserType 
	from LoginDetail a 
	where a.LoginId = LoginId

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE RestoreClaimById
(
	ClaimId BIGINT,
	Category nvarchar(100),
	UserId BIGINT
)
BEGIN
	
	declare ExpenseId as bigint

	If Category = 'Corporate'
		BEGIN
			Set ExpenseId = (SELECT /* LIMIT 1 */ A.ExpenseId From EMS_Expense.ClaimMaster A Where A.Id = ClaimId)

			Update EMS_Expense.ExpenseMaster Set Status = 'Pending' where Id = ExpenseId
			Update EMS_Expense.ClaimMaster 
				Set Status = 'Pending', 
				TotalAmountBySupervisor = NULL, 
				TotalAmountByAuditor = NULL,
				TotalAmountByAccountant = NULL,
				ModifiedBy = UserId,
				ModifiedOn = NOW()
			where ExpenseId = ExpenseId

		END
	ELSE
		BEGIN
			Set ExpenseId = (SELECT /* LIMIT 1 */ A.ExpenseId From EMS_Expense.ClaimMasterSales A Where A.Id = ClaimId)

			Update EMS_Expense.ExpenseMasterSales Set Status = 'Pending' where Id = ExpenseId
			Update EMS_Expense.ClaimMasterSales 
				Set Status = 'Pending', 
				TotalAmountBySupervisor = NULL, 
				TotalAmountByAuditor = NULL,
				TotalAmountByAccountant = NULL,
				ModifiedBy = UserId,
				ModifiedOn = NOW()
			where ExpenseId = ExpenseId

		END

	
END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_ApproveOrDisapproveRequest
(
	Id bigint ,
	AproveStatus nvarchar(100) 
)
BEGIN

	UPDATE  MeetingDetails 
	SET	AproveStatus = AproveStatus
	WHERE Id = Id

END
 //
DELIMITER ;


DELIMITER //
CREATE procedure USP_CheckLogin
(
	Email nvarchar(50)
	,Password nvarchar(50)
)
BEGIN

	select * 
	,(Select DepartmentName from Departments b where b.Id = a.DepartmentId) as DepartmentName
	,(Select DesignationName from Designation b where b.Id = a.DesignationId) as DesignationName
	from Employees a
	where a.IsDeleted=0 and
	 a.Email = Email 
	 and a.Password = Password

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_CheckLoginAccountant
(
	UserName nvarchar(100)
	,Password nvarchar(100)
)
BEGIN
	select --* 
	a.Id as AccountantId
	,(Select b.EmpId from Employees b where b.Id = a.EmployeeId) as Accountant_EmpId
	,(Select b.FirstName from Employees b where b.Id = a.EmployeeId) as FirstName
	,(Select b.LastName from Employees b where b.Id = a.EmployeeId) as LastName
	,(Select b.FirstName + ' ' + b.LastName from Employees b where b.Id = a.EmployeeId) as FullName
	,(Select c.DepartmentName from Departments c where c.Id = (Select b.DepartmentId from Employees b where b.Id = a.EmployeeId)) as DepartmentName
	,(Select c.DesignationName from Designation c where c.Id = (Select b.DesignationId from Employees b where b.Id = a.EmployeeId)) as DesignationName
	,IsAdmin
	,Category
	from Accountant a
	where a.IsDeleted=0 and
	 a.UserName = UserName 
	 and a.Password = Password

END

--exec USP_CheckLoginAccountant 'xyz','111'
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_CreateMeetingsRequest
(
	EmployeeId bigint 
	,Location bigint 
	,Floor bigint 
	,Room bigint 
	,Purpose nvarchar(MAX)
	,Date date
	,TimeFrom nvarchar(50)
	,TimeTo nvarchar(50)
	,AproveStatus nvarchar(50)
	,MeetingRequestId bigint
	,Flag nvarchar(10)
)
BEGIN

IF Flag = 'INSERT'
	BEGIN
		INSERT INTO 
			MeetingDetails
			(
			  Location
			 ,Floor
			 ,Room
			 ,Purpose
			 ,Date
			 ,TimeFrom
			 ,TimeTo
			 ,AproveStatus
			 ,UserId
			)
		VALUES
			(
			  Location
			 ,Floor
			 ,Room
			 ,Purpose
			 ,Date
			 ,TimeFrom
			 ,TimeTo
			 ,AproveStatus	--PENDING
			 ,EmployeeId
			)
	END
ELSE	--UPDATE
	BEGIN
		UPDATE 
			MeetingDetails
		SET 
			  Location     = Location
			 ,Floor		   = Floor
			 ,Room		   = Room
			 ,Purpose	   = Purpose
			 ,Date		   = Date
			 ,TimeFrom	   = TimeFrom
			 ,TimeTo	   = TimeTo
			 --,AproveStatus = AproveStatus	
			 ,UserId	   = EmployeeId
		WHERE
			Id = MeetingRequestId
	END


END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_DeleteMeetingRequest
(
	Id bigint 
)
BEGIN

	DELETE FROM MeetingDetails WHERE Id = Id 

END
 //
DELIMITER ;


DELIMITER //
create procedure USP_DoLogOut
(
	MACAddress nvarchar(MAX),
	IPAddress nvarchar(MAX),
	UserId bigint,
	LoginUserType int
)
BEGIN

	update LoginDetail set LogoutDatetime = NOW(), IsActive = 0
	where IsDeleted = 0 
	  --and IsActive = 1
	and MACAddress = MACAddress
	and IPAddress = IPAddress
	and UserId = UserId
	and LoginUserType = LoginUserType

END
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetAccountant
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		(Select a1.FirstName + ' ' + a1.LastName from Employees a1 where a1.Id= A.EmployeeId) as Accountant
	FROM Accountant A
	WHERE A.IsDeleted = 0

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetAgreemnt
(
	Id bigint 
)
BEGIN

	SELECT /* LIMIT 1 */ Description,IsCompleted FROM Agreement

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetAllChoreiMessage
(
	Id bigint 
)
BEGIN
	

	SELECT --top 1 --* 
		A.Id,
		A.PdfPath,
		CAST(A.CreatedOn AS CHAR) as CreatedOn,
		CAST(A.ModifiedOn AS CHAR) as ModifiedOn,
		Title
	FROM ChoreiMessage A
	--WHERE A.Id = Id
	Order by Id desc

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetAllCommentById
(
	Id bigint 
)
BEGIN
	
	SELECT --* 
		A.Id,
		A.Comment,
		(Select a1.FirstName + ' ' + a1.LastName from Employees a1 where a1.Id = A.UserId) as Name,
		(Select a1.UserPhoto from Employees a1 where a1.Id = A.UserId) as UserPhoto,
		(Case when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) <= 1 then CAST(abs(TIMESTAMPDIFF(SECOND, NOW(), A.CreatedOn)%3600/60) AS CHAR(5)) + ' minutes ago'
			  when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) > 23 then CAST(A.CreatedOn AS CHAR)
			else CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) + ' hours ago'
			end) as CreatedTime 
	FROM LikeComment A
	WHERE 
	A.ParentId = Id AND
	 A.LikeOrComment = 'COMMENT'
	Order by A.CreatedOn desc

END
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetAsigneeForSupport
(
	Id bigint 
)
BEGIN
	
	Select * from 
	(
		SELECT  --* 
			A.Id,
			'EMP' + cast(A.Id as varchar(10)) as Id2,
			FirstName + ' ' + LastName as Name,
			'EMPLOYEE' as Flag
		FROM Employees A
		WHERE --A.Id = Id
			A.IsDeleted = 0
			and A.DepartmentId = 17	--17 for IT Department
		--Order by FirstName + ' ' + LastName asc

		union

		SELECT  --* 
			A.Id,
			'GRP' + cast(A.Id as varchar(10)) as Id2,
			A.Title as Name,
			'GROUP' as Flag
		FROM Group A 
		where A.IsDeleted = 0
	) AS TDATA
	Order by Name asc

END
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetBirtdateTodayByUser
(
	Id bigint,
	Type nvarchar(100) 
)
BEGIN
	
--	--supplying a data contract
--IF 1 = 2 BEGIN
--    SELECT
--        cast(null as bigint)  as MyPrimaryKey,
--        cast(null as int)    as OtherColumn
--    WHERE
--        1 = 2  
--END

SET FMTONLY OFF

	Select  *,
	Cast(TIMESTAMPDIFF(YEAR, Birthdate2, NOW()) as varchar(10)) + ' ' as Birthdate	
	into #Temdata
	from 
	(
		SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		--(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--CAST(A.CreatedOn AS CHAR) as CreatedOn,
		A.UserPhoto
		,(
		  CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME)
		 ) as BirthdateNew

		--,1 as Flag
		--,cast(NOW() as date) aa
		,A.Birthdate as Birthdate2
	FROM Employees A
	) as Tdata
	where Cast(BirthdateNew as date) = cast(NOW() as date)
		and Id = Id
	Order by BirthdateNew asc	--Flag,BirthdateNew asc


	Select * from 
	(
	Select 
		A.Id,A.Name,A.Code,A.UserPhoto,A.BirthdateNew,A.Birthdate2,A.Birthdate,'0' AS CFlag ,
		'' as Comment
	from 
		#Temdata A

		union

	Select 
		B.CommentUserId as Id, 
		(Select A1.FirstName + ' ' + A1.LastName from Employees A1 where A1.Id=B.CommentUserId) Name,
		(Select Upper(left(A1.FirstName,1) + Left(A1.LastName,1)) from Employees A1 where A1.Id=B.CommentUserId) Code,
		(Select A1.UserPhoto from Employees A1 where A1.Id=B.CommentUserId) UserPhoto,
		'' as BirthdateNew,'' as Birthdate2,'' as Birthdate,'1' AS CFlag ,
		B.Comment
	from 
		TodaysBirthdateAndAnniversary B inner join #Temdata A on A.Id=B.BirthdateUsertId
	where
		B.BirthdateUsertId = Id	and
		B.Type = 'BIRTHDAY' 
		and Cast(B.Birthdate as date) = cast(NOW() as date)
	) As Data2
		


	drop table #Temdata

END

--exec USP_GetBirtdateTodayByUser 7, ''
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetBirthdayToday
(
	Id bigint 
)
BEGIN
	
	Select  *,
	--Cast(DATENAME(dw, BirthdateNew) as nvarchar(20)) + ',' + Cast(MONTHNAME(BirthdateNew)  as nvarchar(20)) + ' ' + Cast(DAY(BirthdateNew) as nvarchar(20)) as Birthdate
	--Cast(TIMESTAMPDIFF(YEAR, Birthdate2, NOW()) as varchar(10)) + ' years old' as Birthdate
	Cast(DAY(Birthdate2) as varchar(10)) + ' ' + Cast(MONTHNAME(Birthdate2) as varchar(10)) as Birthdate
	--INTO #TEMPDATA
	from 
	(
		SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as CreatedOn
		,A.UserPhoto
		--,(A.Birthdate) as Birthdate
		--,Cast(DATENAME(dw, A.Birthdate) as nvarchar(20)) + ',' + Cast(MONTHNAME(A.Birthdate)  as nvarchar(20)) + ' ' + Cast(DAY(A.Birthdate) as nvarchar(20)) as Birthdate

		,(
		  CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME)
		 --  CASE when CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME) < cast(DATE_ADD(NOW(), INTERVAL 1 DAY) as DATETIME)  then DATE_ADD(CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME), INTERVAL 1 YEAR)
			--else CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME)
			--end
		 ) as BirthdateNew

		,(
			1
			--CASE WHEN (CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME) < cast(DATE_ADD(NOW(), INTERVAL 1 DAY) as DATETIME)) then 1
			--else 0
			--end
		 ) as Flag
		,cast(NOW() as date) aa
		,A.Birthdate as Birthdate2
	FROM Employees A
	where A.Id not in  (Case	
								When CAST(DATEPART(m, A.Birthdate) AS varchar) = 2 and CAST(DATEPART(d, A.Birthdate) AS varchar) = 29 and DAY(EOMONTH(DATEFROMPARTS(YEAR(NOW()),2,1))) = 28  then  A.Id
								--When DAY(EOMONTH(DATEFROMPARTS(YEAR(NOW()),2,1))) = 28 and DAY(EOMONTH(DATEFROMPARTS(A.Birthdate,2,1))) = 29 then  A.Id
								else 0
								end ) 
	--Order by BirthdateNew desc
	) as Tdata
	where --Cast(BirthdateNew as date) = cast(NOW() as date)
		(DATEFROMPARTS(YEAR(BirthdateNew),CAST(DATEPART(m, BirthdateNew) AS varchar),CAST(DATEPART(d, BirthdateNew) AS varchar))) = cast(NOW() as date)
		--and cast(BirthdateNew as date) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
		--and CAST(BirthdateNew AS CHAR(10)) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
	Order by Flag,BirthdateNew asc

	--SELECT --* 
	--Id,
	--Name,
	--Code,
	--Designation,
	--CreatedOn,
	--UserPhoto,
	--CAST(BirthdateNew AS CHAR(10)) as  BirthdateNew,
	--Flag,
	--Birthdate
	--FROM #TEMPDATA

	--DROP TABLE #TEMPDATA

END

--exec USP_GetBirthdayToday 0
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetClaimDetailAdmin
(
	Requester BIGINT
)
BEGIN
	SELECT --* 
	   A.Id
      ,A.Requester as RequesterId
	  ,(Select IFNULL(A1.FirstName,'') + ' ' + IFNULL(A1.LastName,'') from EMS.Employees A1 where A1.Id=A.Requester) as RequesterName
	  ,A.Year
	  ,A.Month
	  ,(Select A1.Type from EMS_Expense.ExpenseMaster A1 where A1.Id=A.ExpenseId) + ' - ' + MONTHNAME(DATE_ADD(-1, INTERVAL A.Month MONTH)) + ' ' + CAST(A.Year as varchar(50)) as ClaimTitle
	  ,Format(A.CreatedOn,'dd/MM/yyyy') as SubmittedOn
	  --,Sum(IFNULL(B.ClaimAmount,0)) as ClaimAmount
	  ,A.TotalAmount as ClaimAmount
	  --,Sum(IFNULL(B.AmountPassedBySupervisor,0)) as AmountPassedBySupervisor
	  ,A.TotalAmountBySupervisor as AmountPassedBySupervisor
	  --,Sum(IFNULL(B.AmountPassedByAuditor,0)) as AmountPassedByAuditor
	  ,A.TotalAmountByAuditor as AmountPassedByAuditor
	  ,Sum(IFNULL(B.AmountHold,0)) as AmountHold
	  --,Sum(IFNULL(B.AmountDeductoin,0)) as AmountDeductoin
	  ,(IFNULL(A.TotalAmount,0) - IFNULL(A.TotalAmountByAuditor,IFNULL(A.TotalAmountBySupervisor,A.TotalAmount))) as AmountDeductoin
	  ,A.Status
	  ,(Select count(1) from EMS_Expense.RemarkLogs A1 where A1.IsDeleted = 0 and  A1.ParentId=A.Id and A1.RemarkType='Claim') as TotalRemark
	  ,(Select A1.IsSpecialApproval from EMS_Expense.ExpenseMaster A1 where A1.Id=A.ExpenseId) as IsSpecialApproval
	  ,(Select A1.SpecialApprovalAttachment from EMS_Expense.ExpenseMaster A1 where A1.Id=A.ExpenseId) as SpecialApprovalAttachment
	  ,A.IsResubmitted
	FROM 
		EMS_Expense.ClaimMaster A INNER JOIN EMS_Expense.ClaimDetail B ON A.Id=B.ClaimId
	WHERE 
		--A.Requester = Requester AND 
		A.IsDeleted=0 
	GROUP BY A.Id,A.Requester,A.Year,A.Month,A.ExpenseId,Format(A.CreatedOn,'dd/MM/yyyy'),A.Status,A.TotalAmount,A.TotalAmountBySupervisor ,A.TotalAmountByAuditor,A.IsResubmitted
	ORDER BY A.Id ASC
END

--exec USP_GetClaimDetailForMyClaim 32
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetClaimDetailAdminSales
(
	Requester BIGINT
)
BEGIN
	SELECT --* 
	   A.Id
      ,A.Requester as RequesterId
	  ,(Select IFNULL(A1.FirstName,'') + ' ' + IFNULL(A1.LastName,'') from EMS.Employees A1 where A1.Id=A.Requester) as RequesterName
	  ,A.Year
	  ,A.Month
	  ,(Select A1.Type from EMS_Expense.ExpenseMasterSales A1 where A1.Id=A.ExpenseId) + ' - ' + MONTHNAME(DATE_ADD(-1, INTERVAL A.Month MONTH)) + ' ' + CAST(A.Year as varchar(50)) as ClaimTitle
	  ,Format(A.CreatedOn,'dd/MM/yyyy') as SubmittedOn
	  --,Sum(IFNULL(B.ClaimAmount,0)) as ClaimAmount
	  ,A.TotalAmount as ClaimAmount
	  --,Sum(IFNULL(B.AmountPassedBySupervisor,0)) as AmountPassedBySupervisor
	  ,A.TotalAmountBySupervisor as AmountPassedBySupervisor
	  --,Sum(IFNULL(B.AmountPassedByAuditor,0)) as AmountPassedByAuditor
	  ,A.TotalAmountByAuditor as AmountPassedByAuditor
	  -- ,A.AmountHold as AmountHold
	  --,Sum(IFNULL(B.AmountHold,0)) as AmountHold
	  --,Sum(IFNULL(B.AmountDeductoin,0)) as AmountDeductoin
	  --,(IFNULL(A.TotalAmount,0) - IFNULL(A.TotalAmountByAuditor,0)) as AmountDeductoin
	  ,(IFNULL(A.TotalAmount,0) - IFNULL(A.TotalAmountByAuditor,IFNULL(A.TotalAmountByAuditor,A.TotalAmount))) as AmountDeductoin
	  ,A.Status
	  ,(Select count(1) from EMS_Expense.RemarkLogs A1 where A1.IsDeleted = 0 and  A1.ParentId=A.Id and A1.RemarkType='ClaimSales') as TotalRemark
	  ,A.IsResubmitted
	FROM 
		EMS_Expense.ClaimMasterSales A INNER JOIN EMS_Expense.ClaimDetailSales B ON A.Id=B.ClaimId
	WHERE 
		--A.Requester = Requester AND 
		A.IsDeleted=0 
	GROUP BY A.Id,A.Requester,A.Year,A.Month,A.ExpenseId,Format(A.CreatedOn,'dd/MM/yyyy'),A.Status,A.TotalAmount,A.TotalAmountBySupervisor ,A.TotalAmountByAuditor,A.IsResubmitted
	ORDER BY A.Id ASC
END

--exec USP_GetClaimDetailForMyClaimSales 782
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetCommentOnTodaysBirthday
(
		   Type nvarchar(100) 
		  ,BirthdateUsertId bigint 
		  ,Birthdate date 
		 
)
BEGIN
	
	SELECT
		   Type
		  ,BirthdateUsertId
		  ,Birthdate
		  ,Comment
		  ,CommentUserId
		  ,CreatedOn
		  ,(select FirstName +' ' + LastName from Employees e where e.Id = CommentUserId) as Name
		  ,(select UserPhoto from Employees e where e.Id = CommentUserId) as UserPhoto
	From
		TodaysBirthdateAndAnniversary
	where 
		BirthdateUsertId = BirthdateUsertId
		and cast(Birthdate as date) = cast(Birthdate as date)
		and Type = Type

END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetCommentOnTodaysBirthdayByUser
(
		   Type nvarchar(100) 
		  ,BirthdateUsertId bigint 
		  ,Birthdate date 
		  ,CommentUserId bigint 
		 
)
BEGIN
	
	SELECT
		   Type
		  ,BirthdateUsertId
		  ,Birthdate
		  ,Comment
		  ,CommentUserId
		  ,CreatedOn
		  ,(select FirstName +' ' + LastName from Employees e where e.Id = CommentUserId) as Name
		  ,(select UserPhoto from Employees e where e.Id = CommentUserId) as UserPhoto
	From
		TodaysBirthdateAndAnniversary
	where 
		BirthdateUsertId = BirthdateUsertId
		and CommentUserId = CommentUserId
		and cast(Birthdate as date) = cast(Birthdate as date)
		and Type = Type

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetDepartment
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		A.DepartmentName 
	FROM Departments A
	--WHERE A.Id = Id

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetDesignation
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		A.DesignationName 
	FROM Designation A
	WHERE A.DepartmentId = Id
	Order by A.DesignationName  asc
END

--exec USP_GetDesignation 15
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetEmployeeDetail
(
	Id bigint 
)
BEGIN
	

	SELECT  --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select Upper(a2.DepartmentName) from Departments a2 where a2.Id = A.DepartmentId) as Department,
		(Select Upper(a2.DesignationName) from Designation a2 where a2.Id = A.DesignationId) as Designation,
		A.MobileNo1,
		Lower(A.Email) as Email,
		CAST(A.CreatedOn AS CHAR) as Date,
		A.UserPhoto
	FROM Employees A
	WHERE A.Id = Id
		--(Id = '' or Id is null or Id = 0 or A.DepartmentId = Id)

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetEmployeeDetailByEmailId
(
	EmailId nvarchar(100) 
)
BEGIN
	

	SELECT  * ,
		--A.Id,
		--FirstName + ' ' + LastName as Name,
		--Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		--A.MobileNo1,
		--A.MobileNo2,
		--Lower(A.Email) as Email,
		--CAST(A.CreatedOn AS CHAR) as Date,
		--A.UserPhoto,
		--A.Password,
		(Select Upper(a2.DepartmentName) from Departments a2 where a2.Id = A.DepartmentId) as DepartmentName,
		(Select Upper(a2.DesignationName) from Designation a2 where a2.Id = A.DesignationId) as DesignationName
	FROM Employees A
	WHERE A.Email = EmailId
		--(Id = '' or Id is null or Id = 0 or A.DepartmentId = Id)

END

--exec USP_GetEmployeeDetailByEmailId 'ankit-gaurunicharm.com'
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetEmployeeDetailById
(
	Id bigint 
)
BEGIN
	

	SELECT  --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select Upper(a2.DepartmentName) from Departments a2 where a2.Id = A.DepartmentId) as Department,
		(Select Upper(a2.DesignationName) from Designation a2 where a2.Id = A.DesignationId) as Designation,
		A.MobileNo1,
		Lower(A.Email) as Email,
		CAST(A.CreatedOn AS CHAR) as Date,
		CAST(A.Birthdate AS CHAR(10)) as Birthdate,
		A.UserPhoto
	FROM Employees A
	WHERE A.Id = Id
		--(Id = '' or Id is null or Id = 0 or A.DepartmentId = Id)

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetEmployeesList
(
	Id bigint 
)
BEGIN
	

	SELECT  --* 
		A.Id,
		IFNULL(FirstName,'') + ' ' + IFNULL(LastName,'') as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select Upper(a2.DepartmentName) from Departments a2 where a2.Id = A.DepartmentId) as Department,
		(Select Upper(a2.DesignationName) from Designation a2 where a2.Id = A.DesignationId) as Designation,
		A.MobileNo1,
		Lower(A.Email) as Email,
		CAST(A.CreatedOn AS CHAR) as Date,
		A.UserPhoto,
		CAST(A.Birthdate AS CHAR) as Birthdate,
		CAST(A.Joiningdate AS CHAR) as Joiningdate,
		A.IsDeleted
	FROM Employees A
	WHERE --A.Id = Id
		(Id = '' or Id is null or Id = 0 or A.DepartmentId = Id)
	Order by IFNULL(FirstName,'') + ' ' + IFNULL(LastName,'') asc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetEventsDetail
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		A.Description as description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		CAST(A.CreatedOn AS CHAR(10)) as Date2,
		A.Image
	FROM Events A
	WHERE A.Id = Id

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetEventsSummary
(
	EmployeeId bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		LEFT(A.Description,500) as description,
		cast(A.Date as date) As Date,
		CAST(A.Date AS CHAR)  as Date1,
		CAST(Date AS CHAR(10)) as Date2,
		DAY(A.Date) AS Day,
		Cast(MONTH(A.Date) as varchar) + ',' + Cast(YEAR(A.Date) as varchar) AS MonthYear,
		Image
	FROM Events A
	--WHERE A.RoleId = RoleId
	ORDER BY A.CreatedOn DESC

END

--  exec USP_GetNoticeSummary 11
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetFloor
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		FloorName as FloorName
	FROM Floor A
	WHERE A.Location = Id
	Order by FloorName asc

END
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetGroupDetailById
(
	IdName nvarchar(20) 
)
BEGIN
	
	Declare Id as bigint  = (Select Replace('GRP17','GRP', ''))

	SELECT  --* 
		A.Id as Id,
		Title
	FROM Group A
	WHERE A.Id = Id
		--(Id = '' or Id is null or Id = 0 or A.DepartmentId = Id)

END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetGroupMembersByGroupId
(
	Id bigint 
)
BEGIN
	

	SELECT  --* 
		A.MemberId as Id,
		(Select a1.FirstName + ' ' + a1.LastName from Employees a1 Where a1.Id= A.MemberId) as Name,
		(Select Title from Group a1 Where a1.Id= A.GroupId) as GroupName
	FROM GroupMember A
	WHERE A.GroupId = Id
		--(Id = '' or Id is null or Id = 0 or A.DepartmentId = Id)

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetLocation
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		LocationName as LocationName
	FROM Location A
	--WHERE A.Id = Id
	Order by LocationName asc

END
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetLoginDetail
(
	Id bigint 
)
BEGIN
	

	SELECT  LoginId
      ,(select a.FirstName + ' ' + a.LastName from Employees a where a.Id = UserId) as UserName
	  ,(select a.Email from Employees a where a.Id = UserId) as Email
	  ,(select b.DepartmentName from Departments b where b.Id = (select a.DepartmentId from Employees a where a.Id = UserId)) as Department
	  ,(select b.DesignationName from Designation b where b.Id = (select a.DesignationId from Employees a where a.Id = UserId)) as Designation
      ,(case when LoginUserType = 1 then 'Admin' else 'User' end ) as LoginUserType
      ,LoginDatetime AS LoginTime
      --,LogoutDatetime
      ,IsActive
	  --,(case when LoginDatetime = LogoutDatetime then 'same' else '' end ) as aa
      --,CreatedDate
      --,IsDeleted
      --,MACAddress
      --,IPAddress
  FROM EMS.LoginDetail
  order by LoginId desc

END

--  exec USP_GetLoginDetail 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMeetingDataForEdit
(
	Id bigint 
)
BEGIN
	

	SELECT  --* 
		A.Id,
		A.Location as Location,
		A.Floor as Floor,
		A.Room as Room,
		A.Purpose as Purpose,
		CAST(A.Date AS CHAR) as Date,
		A.TimeFrom as TimeFrom,
		A.TimeTo as TimeTo
	FROM MeetingDetails A
	WHERE A.Id = Id
	Order by Id desc

END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetMeetingDetailById
(
	MeetingRequestId bigint 
)
BEGIN
	

	SELECT 
		Location
			 ,Floor
			 ,Room
			 ,Purpose
			 ,Date
			 ,TimeFrom
			 ,TimeTo
			 ,AproveStatus
			 ,UserId
	FROM 
		MeetingDetails  
	WHERE 
		Id = MeetingRequestId
	
END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMeetingNotification
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		--Upper(A.Title) as Title,
		A.UserId as UserId,
		A.MobileNo1,
		A.MobileNo2
	FROM MeetingNotification A
	--WHERE A.Id = Id

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMeetingsForCalender
(
	EmployeeId bigint 
	,Location bigint 
	,Floor bigint 
	,Room bigint 
)
BEGIN

	SELECT --* 
		A.Id,
		(SELECT LocationName FROM Location A1 WHERE A1.Id = A.Location) as Location,
		(SELECT FloorName FROM Floor A1 WHERE A1.Id = A.Floor) as Floor,
		(SELECT RoomName FROM Room A1 WHERE A1.Id = A.Room) as Room,
		LEFT(A.Purpose,500) as Purpose,
		CAST(A.Date AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		A.AproveStatus
		,A.TimeFrom
		,A.TimeTo
		,(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.UserId) as UserName
		,(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.UserId)) as Department
		,'Meeting' as Flag
	FROM MeetingDetails A
	WHERE (EmployeeId = 0 or A.UserId = EmployeeId)
	and A.AproveStatus = 'APPROVE'
	--and (Location = 0 or Location = '' or Location is null or A.Location = Location)
	and A.Location = Location
	and (Floor = 0 or Floor = '' or Floor is null or A.Floor = Floor)
	and (Room = 0 or Room = '' or Room is null or A.Room = Room)

	--ORDER BY A.Id DESC

	union

	SELECT --* 
		A.Id,
		'' as Location,
		'' as Floor,
		A.Name as Room,
		'' as Purpose,
		CAST(A.HolidayDate AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		'' as AproveStatus
		,cast(HolidayDate as nvarchar(100)) as TimeFrom
		,cast(HolidayDate as nvarchar(100)) as TimeTo
		,'' as UserName
		,'' as Department
		,'Holiday' as Flag
	FROM Holiday A
	WHERE --(EmployeeId = 0 or A.UserId = EmployeeId)
	--and A.AproveStatus = 'APPROVE'
	(Location != 0 and Location != '' and Location is not null )
	--ORDER BY A.Id DESC

END

--  exec USP_GetMeetingsForCalender 0
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetMeetingsForCalenderNew
(
	EmployeeId bigint 
	,Location bigint 
	,Floor bigint 
	,Room bigint 
	,FromDate date 
	,ToDate date 
)
BEGIN

	SELECT --* 
		A.Id,
		(SELECT LocationName FROM Location A1 WHERE A1.Id = A.Location) as Location,
		(SELECT FloorName FROM Floor A1 WHERE A1.Id = A.Floor) as Floor,
		(SELECT RoomName FROM Room A1 WHERE A1.Id = A.Room) as Room,
		LEFT(A.Purpose,500) as Purpose,
		CAST(A.Date AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		A.AproveStatus
		,A.TimeFrom
		,A.TimeTo
		,(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.UserId) as UserName
		,(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.UserId)) as Department
		,'Meeting' as Flag
	FROM MeetingDetails A
	WHERE (EmployeeId = 0 or A.UserId = EmployeeId)
	and A.AproveStatus = 'APPROVE'
	--and (Location = 0 or Location = '' or Location is null or A.Location = Location)
	and A.Location = Location
	and (Floor = 0 or Floor = '' or Floor is null or A.Floor = Floor)
	and (Room = 0 or Room = '' or Room is null or A.Room = Room)
	and (cast(A.Date as date) between FromDate and ToDate)
	--ORDER BY A.Id DESC

	union

	SELECT --* 
		A.Id,
		'' as Location,
		'' as Floor,
		A.Name as Room,
		'' as Purpose,
		CAST(A.HolidayDate AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		'' as AproveStatus
		,cast(HolidayDate as nvarchar(100)) as TimeFrom
		,cast(HolidayDate as nvarchar(100)) as TimeTo
		,'' as UserName
		,'' as Department
		,'Holiday' as Flag
	FROM Holiday A
	WHERE --(EmployeeId = 0 or A.UserId = EmployeeId)
	--and A.AproveStatus = 'APPROVE'
	(Location != 0 and Location != '' and Location is not null )
	and (cast(A.HolidayDate as date) between FromDate and ToDate) 
	--ORDER BY A.Id DESC

END

--  exec USP_GetMeetingsForCalender 0
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMeetingsForUser
(
	EmployeeId bigint 
)
BEGIN

	SELECT --* 
		A.Id,
		(SELECT LocationName FROM Location A1 WHERE A1.Id = A.Location) as Location,
		(SELECT FloorName FROM Floor A1 WHERE A1.Id = A.Floor) as Floor,
		(SELECT RoomName FROM Room A1 WHERE A1.Id = A.Room) as Room,
		LEFT(A.Purpose,500) as Purpose,
		CAST(A.Date AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		A.AproveStatus
		,A.TimeFrom
		,A.TimeTo
		,(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.UserId) as UserName
		,(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.UserId)) as Department
		,A.UserId
	FROM MeetingDetails A
	WHERE (EmployeeId = 0 or A.UserId = EmployeeId)
	ORDER BY A.Id DESC

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMeetingsForUserForAPI
(
	EmployeeId bigint 
	, PageOffSet int
)
BEGIN

		DECLARE  PageSize as int
		SET PageSize = 5

	SELECT --* 
		A.Id,
		A.Location as LocationId,
		(SELECT LocationName FROM Location A1 WHERE A1.Id = A.Location) as Location,
		A.Floor as FloorId,
		(SELECT FloorName FROM Floor A1 WHERE A1.Id = A.Floor) as Floor,
		A.Room as RoomId,
		(SELECT RoomName FROM Room A1 WHERE A1.Id = A.Room) as Room,
		LEFT(A.Purpose,500) as Purpose,
		CAST(A.Date AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		A.AproveStatus
		,A.TimeFrom
		,A.TimeTo
		,(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.UserId) as UserName
		,(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.UserId)) as Department
		,A.UserId
	FROM MeetingDetails A
	WHERE (EmployeeId = 0 or A.UserId = EmployeeId)
	ORDER BY A.Id DESC
	OFFSET PageOffSet ROWS 
	FETCH NEXT PageSize ROWS ONLY;

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMeetingsForUserNew
(
	EmployeeId bigint 
	,Location bigint 
	,Floor bigint 
	,Room bigint 
	,FromDate date 
	,ToDate date 
)
BEGIN

	SELECT --* 
		A.Id,
		(SELECT LocationName FROM Location A1 WHERE A1.Id = A.Location) as Location,
		(SELECT FloorName FROM Floor A1 WHERE A1.Id = A.Floor) as Floor,
		(SELECT RoomName FROM Room A1 WHERE A1.Id = A.Room) as Room,
		LEFT(A.Purpose,500) as Purpose,
		CAST(A.Date AS CHAR) as Date,
		cast(A.CreatedOn as date) AS CreatedOn,
		A.AproveStatus
		,A.TimeFrom
		,A.TimeTo
		,(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.UserId) as UserName
		,(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.UserId)) as Department
	FROM MeetingDetails A
	WHERE (EmployeeId = 0 or EmployeeId = '' or EmployeeId is null or A.UserId = EmployeeId)
	and (Location = 0 or Location = '' or Location is null or A.Location = Location)
	and (Floor = 0 or Floor = '' or Floor is null or A.Floor = Floor)
	and (Room = 0 or Room = '' or Room is null or A.Room = Room)
	and (cast(A.Date as date) between FromDate and ToDate)
	ORDER BY A.Id DESC

END

--  exec USP_GetMeetingsForUserNew 0,0,0,0,'2020-10-03 15:23:30.900','2020-10-03 15:23:30.900'
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMessageDetail
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		A.Quote as description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date
	FROM Messages A
	WHERE A.Id = Id

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetMessageSummary
(
	EmployeeId bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		LEFT(A.Quote,500) as description,
		cast(A.CreatedOn as date) As Date,
		DAY(A.CreatedOn) AS Day,
		Cast(MONTH(A.CreatedOn) as varchar) + ',' + Cast(YEAR(A.CreatedOn) as varchar) AS MonthYear,
		(select DepartmentName from Departments a1 where a1.Id = A.AddedBy) as DepartmentName
	FROM Messages A
	--WHERE A.RoleId = RoleId
	ORDER BY A.CreatedOn DESC

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetNewEmployees
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 3 */ --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		A.UserPhoto
	FROM Employees A
	--WHERE A.Id = Id
	Order by Joiningdate desc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetNewsDetail
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		A.Description as description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date
		,CAST(A.CreatedOn AS CHAR(10)) as Date2
		,A.Image
	FROM News A
	WHERE A.Id = Id

END

--  exec USP_GetNewsDetail 10
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetNewsSummary
(
	EmployeeId bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		LEFT(A.Description,500) as description,
		cast(A.CreatedOn as date) As Date,
		CAST(A.CreatedOn AS CHAR)  as Date1,
		CAST(CreatedOn AS CHAR(10)) as Date2,
		DAY(A.CreatedOn) AS Day,
		Cast(MONTH(A.CreatedOn) as varchar) + ',' + Cast(YEAR(A.CreatedOn) as varchar) AS MonthYear
		,A.Image
	FROM News A
	--WHERE A.RoleId = RoleId
	ORDER BY A.CreatedOn DESC

END

--  exec USP_GetNoticeSummary
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetNoticeDetail
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		A.description as description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date
	FROM Notice A
	WHERE A.Id = Id

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetNoticeSummary
(
	EmployeeId bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		LEFT(A.description,500) as description,
		A.Date,
		DAY(A.Date) AS Day,
		Cast(MONTH(A.Date) as varchar) + ',' + Cast(YEAR(A.Date) as varchar) AS MonthYear
	FROM Notice A
	--WHERE A.Role = RoleId
	ORDER BY A.Date DESC

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetPhotoGalleryDetail
(
	Id bigint 
)
BEGIN
	
	Select * from (
	SELECT  --* 
		A.Id,
		Title as Title,
		A.Image,
		--CAST(A.CreatedOn AS CHAR) as Date,
		1 as Flag
	FROM PhotoGallery A
	WHERE A.Id = Id
	--Order by Id desc

	union 

	SELECT  --* 
		A.Id,
		'' as Title,
		A.Image,
		--CAST(A.CreatedOn AS CHAR) as Date,
		0 as Flag
	FROM UploadedImages A
	WHERE A.ParentId = Id
	) TDATA
END

--exec USP_GetPhotoGalleryDetail 14
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetPolicyDetail
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		A.description as description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date
	FROM Policies A
	WHERE A.Id = Id

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetPolicyNewSummary
(
	Id bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	--SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		PdfPath,
		--CAST(A.CreatedOn AS CHAR) as CreatedOn,
		FORMAT(A.CreatedOn,'MMM dd yyyy hh:mmtt') as CreatedOn,
		DAY(A.CreatedOn) AS Day,
		Cast(MONTH(A.CreatedOn) as varchar) + ',' + Cast(YEAR(A.CreatedOn) as varchar) AS MonthYear
	FROM PolicyNew A
	--WHERE A.Role = RoleId
	ORDER BY A.CreatedOn DESC

END

--  exec USP_GetPolicyNewSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetPolicySummary
(
	EmployeeId bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Title) as Title,
		LEFT(A.description,500) as description,
		A.Date,
		DAY(A.Date) AS Day,
		Cast(MONTH(A.Date) as varchar) + ',' + Cast(YEAR(A.Date) as varchar) AS MonthYear
	FROM Policies A
	WHERE A.Role = RoleId
	ORDER BY A.Date DESC

END

--  exec USP_GetPolicySummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetProductDetailById
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		Upper(A.Name) as Name,
		A.Description as Description,
		A.UserPhoto,
		CAST(A.CreatedOn AS date) AS CreatedOn
	FROM Product A
	WHERE A.Id = Id
	ORDER BY A.Name ASC

END

--  exec USP_GetProductDetailById 3
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetProductSummary
(
	EmployeeId bigint 
)
BEGIN
	
	DECLARE RoleId as bigint 

	--SET RoleId = (SELECT A.RoleId FROM Employees A WHERE A.Id = EmployeeId)

	SELECT --* 
		A.Id,
		Upper(A.Name) as Name,
		A.Description as Description,
		A.UserPhoto,
		CAST(A.CreatedOn AS date) AS CreatedOn
	FROM Product A
	--WHERE A.Role = RoleId
	ORDER BY A.Name ASC

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentChoreiMessage
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 1 */ --* 
		A.Id,
		A.PdfPath,
		CAST(A.CreatedOn AS CHAR) as CreatedOn,
		CAST(A.ModifiedOn AS CHAR) as ModifiedOn,
		Title
	FROM ChoreiMessage A
	--WHERE A.Id = Id
	Order by Id desc

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentComment
(
	Id bigint 
)
BEGIN
	
	SELECT /* LIMIT 3 */--* 
		A.Id,
		A.Comment,
		(Select a1.FirstName + ' ' + a1.LastName from Employees a1 where a1.Id = A.UserId) as Name,
		(Select a1.UserPhoto from Employees a1 where a1.Id = A.UserId) as UserPhoto,
		(Case when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) <= 1 then CAST(abs(TIMESTAMPDIFF(SECOND, NOW(), A.CreatedOn)%3600/60) AS CHAR(5)) + ' minutes ago'
			  when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) > 23 then CAST(A.CreatedOn AS CHAR)
			else CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) + ' hours ago'
			end) as CreatedTime 
	FROM LikeComment A
	WHERE 
	A.ParentId = Id AND
	 A.LikeOrComment = 'COMMENT'
	Order by A.CreatedOn desc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentCompanyImages
(
	Id bigint 
)
BEGIN
	
	Declare Cid as bigint , Title as nvarchar(100)

	Set Cid = (SELECT /* LIMIT 1 */ A.Id--* 
			FROM CompanyImages A 
			--WHERE A.Id = Id
			Order by Id desc)

	Set Title = (SELECT /* LIMIT 1 */ A.Title--* 
			FROM CompanyImages A 
			--WHERE A.Id = Id
			Order by Id desc)

	SELECT 
		Cid as id,
		Title as Title,
		A.Image as Image
	FROM UploadedImages A 
	WHERE A.Type = 'companyimages'
	and A.ParentId = Cid

END

-- exec USP_GetRecentCompanyImages 0
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetRecentCustomImage
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 1 */
			  Id
			 ,Image
			 ,Type
			 ,ShowType
			 ,CreatedOn

	FROM 
		CustomImage  
	--WHERE 
	--	Id = Id
	Order By CreatedOn desc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentEvent
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 4 */ --* 
		A.Id,
		Upper(Title) as Title,
		--Left(A.Description,70) as Description,
		A.Description as Description,
		--A.Date,
		CAST(A.Date AS CHAR) as Date,
		--CAST(A.CreatedOn AS CHAR) as Date,
		CAST(A.Date AS CHAR)  as Date1,
		CAST(A.Date AS CHAR(10)) as Date2,
		A.Image
	FROM Events A
	--WHERE A.Id = Id
	Order by CAST(A.Date AS CHAR(10)) desc

END

--exec USP_GetRecentEvent 0
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentMessages
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 1 */ --* 
		A.Id,
		A.Title as Title,
		Left(A.Quote,250) as Description,
		(Select FirstName + ' ' + LastName from Employees a1 where a1.Id = A.AddedBy) as AddedBy,
		(Select a2.DesignationName from Designation a2 where a2.Id =(Select a1.DesignationId from Employees a1 where a1.Id = A.AddedBy)) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date
	FROM Messages A
	--WHERE A.Id = Id
	Order by Id desc

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentNews
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 4 */ --* 
		A.Id,
		Upper(Title) as Title,
		A.Description as Description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		CAST(A.CreatedOn AS CHAR)  as Date1,
		CAST(A.CreatedOn AS CHAR(10)) as Date2,
		A.Image
	FROM News A
	--WHERE A.Id = Id
	Order by CAST(A.CreatedOn AS CHAR(10)) desc

END


--exec USP_GetRecentNews 0
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentPhotoGallery
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 5 */ --* 
		A.Id,
		Title as Title,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		A.Image,
		(select count(1) from UploadedImages a1 where a1.Type = 'photogalleries' and a1.ParentId = A.Id) as TotalPolicy
	FROM PhotoGallery A
	--WHERE A.Id = Id
	Order by Id desc

END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetRecentPhotoGalleryAll
(
	Id bigint 
)
BEGIN
	

	SELECT --top 5 --* 
		A.Id,
		Title as Title,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		A.Image,
		(select count(1) from UploadedImages a1 where a1.Type = 'photogalleries' and a1.ParentId = A.Id) as TotalPolicy
	FROM PhotoGallery A
	--WHERE A.Id = Id
	Order by Id desc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentPolicies
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 5 */ --* 
		A.Id,
		Upper(Title) as Title,
		''as Description,
		--A.CreatedOn,
		Cast(DATENAME(dw, A.CreatedOn) as nvarchar(20)) + ',' + Cast(MONTHNAME(A.CreatedOn)  as nvarchar(20)) + ' ' + Cast(DAY(A.CreatedOn) as nvarchar(20)) as Date,
		A.PdfPath as Image,
		(select count(1) from PolicyNew a1) as TotalPolicy
	FROM PolicyNew A
	--WHERE A.Id = Id
	Order by Id desc

END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetRecentProduct
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 3 */ --* 
		A.Id,
		Upper(Name) as Title,
		Left(A.Description,70) as Description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		A.UserPhoto as Image
	FROM Product A
	--WHERE A.Id = Id
	Order by Id desc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetRecentQuote
(
	Id bigint 
)
BEGIN
	

	SELECT /* LIMIT 1 */ --* 
		A.Id,
		A.Title as Title,
		A.Quote as Quote,
		(Select FirstName + ' ' + LastName from Employees a1 where a1.Id = A.AddedBy) as AddedBy,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date
	FROM QuoteOfTheDay A
	--WHERE A.Id = Id
	Order by Id desc

END

--  exec USP_GetNoticeSummary 4
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetRoom
(
	Id bigint 
)
BEGIN
	

	SELECT --* 
		A.Id,
		RoomName as RoomName
	FROM Room A
	WHERE A.Floor = Id
	Order by RoomName asc

END

--exec USP_GetRoom 2
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetTicketDetailByTicketId
(
	TicketId bigint 
)
BEGIN
	
	declare tmp varchar(250), AllAssignee varchar(250)

	SET tmp = ''
	select tmp = tmp + (Select(IFNULL((Select FirstName+' '+LastName from Employees A1 where isdeleted = 0 and A1.Id=A.AssigneeId),''))) + ', ' from TicketAssignee A 
	where A.TicketId = TicketId


	--select SUBSTRING(tmp, 0, CHAR_LENGTH(tmp))
	Set AllAssignee = (Select SUBSTRING(tmp, 0, CHAR_LENGTH(tmp)))

	SELECT 
	   Id
	   ,A.Requester as RequesterId
      ,(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester
	  ,(Select A2.DepartmentName from Departments A2 where A2.Id = (Select A1.DepartmentId from Employees A1 where A1.Id=A.Requester))  as Department
      ,Title
      ,Description
      ,(SELECT A1.Name FROM Region A1 WHERE A1.Id = A.Region) as Region
      ,IFNULL((SELECT A1.Name FROM City A1 WHERE Cast(A1.Id as nvarchar(50))=A.City), A.City) as City
      ,(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type
      ,TagId
      ,(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Priority
      ,Status
      ,MobileNo
	  ,CreatedOn
	  ,FORMAT(A.CreatedOn,'dd-MM-yyyy h:mm tt') as SubmitDate
      ,IsDeleted
      ,IsManagerNotified
	  ,AllAssignee as AllAssignee
	  ,IsClosed
  FROM Ticket A
	Where Id = TicketId


END

--exec USP_GetTicketDetailForNotification 9, 1
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetTicketDetailForNotification
(
	Id bigint 
	,ApproverId bigint 
)
BEGIN
	


	SELECT --* 
		Id,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
		(Select Email from Employees A1 where A1.Id=A.Requester) as RequesterEmail,
      	A.Title,
		A.Description,
		(SELECT A1.Name FROM Region A1 WHERE A1.Id = A.Region) as Region,
		(SELECT A1.Name FROM City A1 WHERE A1.Id = A.City) as City,
		(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
		(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
		A.Status,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=ApproverId) as ApproverName,
		(Select Email from Employees A1 where A1.Id=ApproverId) as ApproverEmail
	FROM Ticket A
	Where Id = Id


END

--exec USP_GetTicketDetailForNotification 9, 0
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetTicketDetailForNotificationForAll
(
	Id bigint 
	,RepliedbyBy bigint 
)
BEGIN
	

		SELECT --* 
		A.Id,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
		(Select Email from Employees A1 where A1.Id=A.Requester) as RequesterEmail,
      	A.Title,
		A.Description,
		(SELECT A1.Name FROM Region A1 WHERE A1.Id = A.Region) as Region,
		(SELECT A1.Name FROM City A1 WHERE A1.Id = A.City) as City,
		(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
		(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
		A.Status,
		(Select A1.Id from Employees A1 where A1.Id = A.Requester) as ApproverId,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as ApproverName,
		(Select Email from Employees A1 where A1.Id=A.Requester) as ApproverEmail,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=RepliedbyBy) as RepliedByName,
		'Requester' as TType
	FROM Ticket A inner join Employees TA on A.Requester = TA.Id
	Where A.Id = Id

	Union

	SELECT --* 
		A.Id,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
		(Select Email from Employees A1 where A1.Id=A.Requester) as RequesterEmail,
      	A.Title,
		A.Description,
		(SELECT Title FROM Region A1 WHERE A1.Id = A.Region) as Region,
		(SELECT Title FROM City A1 WHERE A1.Id = A.City) as City,
		(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
		(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
		A.Status,
		(Select A1.Id from Employees A1 where A1.Id = TA.AssigneeId) as ApproverId,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id = TA.AssigneeId) as ApproverName,
		(Select Email from Employees A1 where A1.Id = TA.AssigneeId) as ApproverEmail,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=RepliedbyBy) as RepliedByName
		,'Assignee' as TType
	FROM Ticket A inner join TicketAssignee TA on A.Id = TA.TicketId
	Where A.Id = Id

	Union 

	
	SELECT --* 
		A.Id,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
		(Select Email from Employees A1 where A1.Id=A.Requester) as RequesterEmail,
      	A.Title,
		A.Description,
		(SELECT Title FROM Region A1 WHERE A1.Id = A.Region) as Region,
		(SELECT Title FROM City A1 WHERE A1.Id = A.City) as City,
		(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
		(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
		A.Status,
		(Select A1.Id from Employees A1 where A1.Id = TA.FollowerId) as ApproverId,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id = TA.FollowerId) as ApproverName,
		(Select Email from Employees A1 where A1.Id = TA.FollowerId) as ApproverEmail,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=RepliedbyBy) as RepliedByName,
		'Follower' as TType
	FROM Ticket A inner join TicketFollower TA on A.Id = TA.TicketId
	Where A.Id = Id


END

--exec USP_GetTicketDetailForNotificationForAll 31
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetTicketForAdmin
(
	EmployeeId bigint ,
	FileterType nvarchar(20) 
)
BEGIN

SET FMTONLY OFF


Declare FromDate as date, ToDate as date

IF FileterType = 'Weekly'
	Begin
		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -7 DAY))
		SET ToDate = (Select NOW())
	END
ELSE IF FileterType = 'Monthly'
	Begin
		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -30 DAY))
		SET ToDate = (Select NOW())
	END
ELSE IF FileterType = 'Yearly'
	Begin
		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -365 DAY))
		SET ToDate = (Select NOW())
	END
ELSE --FileterFrom = 'All'
	Begin
		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -3650 DAY))
		SET ToDate = (Select NOW())
	END


	SELECT * INTO #TDATA FROM
	(
		SELECT --* 
			A.Id,
			(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
			(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.Requester)) as Department,
			A.Title,
			A.Description,
			(SELECT Title FROM Region A1 WHERE A1.Id = A.Region) as Region,
			--(SELECT Title FROM City A1 WHERE A1.Id = A.City) as City,
			IFNULL((SELECT A1.Name FROM City A1 WHERE Cast(A1.Id as nvarchar(50))=A.City), A.City) as City,
			(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
			(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
			A.Status,
			--CAST(A.CreatedOn AS CHAR) as Date,
			cast(A.CreatedOn as date) AS Date,
			(Case when (YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) = 0 then 
					(Case when(MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) = 0 then 
								(Case when(DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) = 0 then 
										(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) = 0 then 
												(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) = 0 then 
														(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) = 0 then 'Now'
															--(
															--	)
															else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
													else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
											else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
									else Cast((DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) as varchar(10)) + ' days ago' end)
						else Cast((MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) as varchar(10)) + ' months ago' end)
			else Cast((YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) as varchar(10)) + ' years ago' end) AS Created,
			--'' as LastActivity,
			A.CreatedOn,
			(Select Max(TA.CreatedOn) From TicketAssignee TA Where TA.TicketId = A.Id) as AsigneeCreatedOn
			,(SELECT /* LIMIT 1 */ TA.Star1 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star1
			,(SELECT /* LIMIT 1 */ TA.Star2 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star2
			,(SELECT /* LIMIT 1 */ TA.Star3 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star3
			,(SELECT /* LIMIT 1 */ TA.Star4 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star4
			,(SELECT /* LIMIT 1 */ TA.Star5 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star5
		FROM Ticket A
		WHERE 
		--(EmployeeId = 0 or EmployeeId = '' or EmployeeId is null or A.Requester = EmployeeId)
		--A.Requester = EmployeeId
		(EmployeeId = 0 or EmployeeId = '' or EmployeeId is null or  A.Id in (Select TA.TicketId From TicketAssignee TA Where TA.AssigneeId = EmployeeId))
		--and (Year = 0 or YEAR(cast(A.CreatedOn as datetime)) = Year)
		--and (Month = 0 or MONTH(cast(A.CreatedOn as datetime)) = Month)
		and cast(A.CreatedOn as date) between FromDate and ToDate
		--ORDER BY A.Id DESC
	) AS TDATA


--SELECT * ,
--(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then
--	(Case when (YEAR(NOW()) - YEAR(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--						(Case when(MONTH(NOW()) - MONTH(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--									(Case when(DAY(NOW()) - DAY(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--											(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--													(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--															(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.AsigneeCreatedOn as datetime))) = 0 then 'Now'
--																--(
--																--	)
--																else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
--														else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
--												else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
--										else Cast((DAY(NOW()) - DAY(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' days ago' end)
--							else Cast((MONTH(NOW()) - MONTH(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' months ago' end)
--				else Cast((YEAR(NOW()) - YEAR(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' years ago' end)
--		else 'No Reply' end) AS LastActivity
--FROM #TDATA A


SELECT * ,
FORMAT(A.CreatedOn,'dd-MM-yyyy h:mm tt') as CreatedOn2,
(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then FORMAT(A.AsigneeCreatedOn,'dd-MM-yyyy h:mm tt') 
		else 'No Reply' end) AS LastActivity
FROM #TDATA A

DROP TABLE #TDATA


END

--  exec USP_GetTicketForAdmin 32,0
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetTicketForAssignee
(
	EmployeeId bigint ,
	Year int ,
	Month int 
)
BEGIN

	SET FMTONLY OFF

	SELECT * INTO #TDATA FROM
	(
		SELECT --* 
			A.Id,
			(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
			(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.Requester)) as Department,
			A.Title,
			A.Description,
			(SELECT Title FROM Region A1 WHERE A1.Id = A.Region) as Region,
			--(SELECT Title FROM City A1 WHERE A1.Id = A.City) as City,
			IFNULL((SELECT A1.Name FROM City A1 WHERE Cast(A1.Id as nvarchar(50))=A.City), A.City) as City,
			(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
			(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
			A.Status,
			--CAST(A.CreatedOn AS CHAR) as Date,
			cast(A.CreatedOn as date) AS Date,
			(Case when (YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) = 0 then 
					(Case when(MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) = 0 then 
								(Case when(DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) = 0 then 
										(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) = 0 then 
												(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) = 0 then 
														(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) = 0 then 'Now'
															--(
															--	)
															else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
													else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
											else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
									else Cast((DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) as varchar(10)) + ' days ago' end)
						else Cast((MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) as varchar(10)) + ' months ago' end)
			else Cast((YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) as varchar(10)) + ' years ago' end) AS Created,
			--'' as LastActivity,
			A.CreatedOn,
			(SELECT /* LIMIT 1 */ TA.Status From TicketAssignee TA Where TA.AssigneeId = EmployeeId and TA.TicketId = A.Id) as AsigneeStatus,
			(SELECT /* LIMIT 1 */ TA.CreatedOn From TicketAssignee TA Where TA.AssigneeId = EmployeeId and TA.TicketId = A.Id) as AsigneeCreatedOn
			,(SELECT /* LIMIT 1 */ TA.Star1 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star1
			,(SELECT /* LIMIT 1 */ TA.Star2 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star2
			,(SELECT /* LIMIT 1 */ TA.Star3 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star3
			,(SELECT /* LIMIT 1 */ TA.Star4 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star4
			,(SELECT /* LIMIT 1 */ TA.Star5 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star5
		FROM Ticket A
		WHERE  A.Id in (Select TA.TicketId From TicketAssignee TA Where TA.AssigneeId = EmployeeId)
			and (Year = 0 or YEAR(cast(A.CreatedOn as datetime)) = Year)
			and (Month = 0 or MONTH(cast(A.CreatedOn as datetime)) = Month)
		--ORDER BY A.Id DESC
	) AS TDATA


--SELECT * ,
--(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then
--	(Case when (YEAR(NOW()) - YEAR(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--						(Case when(MONTH(NOW()) - MONTH(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--									(Case when(DAY(NOW()) - DAY(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--											(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--													(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--															(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.AsigneeCreatedOn as datetime))) = 0 then 'Now'
--																--(
--																--	)
--																else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
--														else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
--												else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
--										else Cast((DAY(NOW()) - DAY(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' days ago' end)
--							else Cast((MONTH(NOW()) - MONTH(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' months ago' end)
--				else Cast((YEAR(NOW()) - YEAR(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' years ago' end) 
--		else 'No Reply' end) AS LastActivity
--FROM #TDATA A

SELECT * ,
FORMAT(A.CreatedOn,'dd-MM-yyyy h:mm tt') as CreatedOn2,
(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then FORMAT(A.AsigneeCreatedOn,'dd-MM-yyyy h:mm tt') 
		else 'No Reply' end) AS LastActivity
FROM #TDATA A


DROP TABLE #TDATA


END

--  exec USP_GetTicketForAssignee 32,0,0
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetTicketForUser
(
	EmployeeId bigint ,
	Year int ,
	Month int 
)
BEGIN

--IF 1 = 1 
--BEGIN

--END

SET FMTONLY OFF

	SELECT * INTO #TDATA FROM
	(
		SELECT --* 
			A.Id,
			(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
			(Select A2.DepartmentName from Departments A2 where A2.Id=(Select A1.DepartmentId from Employees A1 where A1.Id=A.Requester)) as Department,
			A.Title,
			A.Description,
			(SELECT Title FROM Region A1 WHERE A1.Id = A.Region) as Region,
			IFNULL((SELECT A1.Name FROM City A1 WHERE Cast(A1.Id as nvarchar(50))=A.City), A.City) as City,
			(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
			(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
			A.Status,
			--CAST(A.CreatedOn AS CHAR) as Date,
			cast(A.CreatedOn as date) AS Date,
			(Case when (YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) = 0 then 
					(Case when(MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) = 0 then 
								(Case when(DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) = 0 then 
										(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) = 0 then 
												(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) = 0 then 
														(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) = 0 then 'Now'
															--(
															--	)
															else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
													else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
											else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
									else Cast((DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) as varchar(10)) + ' days ago' end)
						else Cast((MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) as varchar(10)) + ' months ago' end)
			else Cast((YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) as varchar(10)) + ' years ago' end) AS Created,
			--'' as LastActivity,
			A.CreatedOn,
			(Select Max(TA.CreatedOn) From TicketAssignee TA Where TA.TicketId = A.Id) as AsigneeCreatedOn
			,(SELECT /* LIMIT 1 */ TA.Star1 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star1
			,(SELECT /* LIMIT 1 */ TA.Star2 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star2
			,(SELECT /* LIMIT 1 */ TA.Star3 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star3
			,(SELECT /* LIMIT 1 */ TA.Star4 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star4
			,(SELECT /* LIMIT 1 */ TA.Star5 From TicketFeedback TA Where TA.TicketId = A.Id Order by TA.Id desc) as Star5
		FROM Ticket A
		WHERE --(EmployeeId = 0 or A.Requester = EmployeeId)
		A.Requester = EmployeeId
		and (Year = 0 or YEAR(cast(A.CreatedOn as datetime)) = Year)
		and (Month = 0 or MONTH(cast(A.CreatedOn as datetime)) = Month)
		--ORDER BY A.Id DESC
	) AS TDATA

--SELECT * ,
--(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then
--	(Case when (YEAR(NOW()) - YEAR(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--						(Case when(MONTH(NOW()) - MONTH(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--									(Case when(DAY(NOW()) - DAY(cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--											(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--													(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.AsigneeCreatedOn as datetime))) = 0 then 
--															(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.AsigneeCreatedOn as datetime))) = 0 then 'Now'
--																--(
--																--	)
--																else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
--														else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
--												else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
--										else Cast((DAY(NOW()) - DAY(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' days ago' end)
--							else Cast((MONTH(NOW()) - MONTH(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' months ago' end)
--				else Cast((YEAR(NOW()) - YEAR(cast(A.AsigneeCreatedOn as datetime))) as varchar(10)) + ' years ago' end)
--		else 'No Reply' end) AS LastActivity
--FROM #TDATA A


SELECT * ,	--A.AsigneeCreatedOn,
FORMAT(A.CreatedOn,'dd-MM-yyyy h:mm tt') as CreatedOn2,
(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then FORMAT(A.AsigneeCreatedOn,'dd-MM-yyyy h:mm tt') 
		else 'No Reply' end) AS LastActivity
FROM #TDATA A


DROP TABLE #TDATA


END

--  exec USP_GetTicketForUser 32,0,0
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetTicketForUser_Chart
(
	EmployeeId bigint ,
	FileterType nvarchar(20) 
)
BEGIN



SET FMTONLY OFF


--Declare FromDate as date, ToDate as date

--IF FileterType = 'Weekly'
--	Begin
--		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -7 DAY))
--		SET ToDate = (Select NOW())
--	END
--ELSE IF FileterType = 'Monthly'
--	Begin
--		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -30 DAY))
--		SET ToDate = (Select NOW())
--	END
--ELSE IF FileterType = 'Yearly'
--	Begin
--		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -365 DAY))
--		SET ToDate = (Select NOW())
--	END
--ELSE --FileterFrom = 'All'
--	Begin
--		SET FromDate = (Select DATE_ADD(NOW(), INTERVAL -3650 DAY))
--		SET ToDate = (Select NOW())
--	END


	SELECT * INTO #TDATA FROM
	(
		SELECT --* 
			A.Id,
			--(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
			--A.Title,
			--A.Description,
			--(SELECT Title FROM Region A1 WHERE A1.Id = A.Region) as Region,
			--(SELECT Title FROM City A1 WHERE A1.Id = A.City) as City,
			--(SELECT Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
			--(SELECT Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
			A.Status--,
			----CAST(A.CreatedOn AS CHAR) as Date,
			--cast(A.CreatedOn as date) AS Date,
			--(Case when (YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) = 0 then 
			--		(Case when(MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) = 0 then 
			--					(Case when(DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) = 0 then 
			--							(Case when(datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) = 0 then 
			--									(Case when(datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) = 0 then 
			--											(Case when(datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) = 0 then 'Now'
			--												--(
			--												--	)
			--												else Cast((datepart(SECOND,NOW()) - datepart(SECOND,cast(A.CreatedOn as datetime))) as varchar(10)) + ' seconds ago' end)
			--										else Cast((datepart(MINUTE,NOW()) - datepart(MINUTE,cast(A.CreatedOn as datetime))) as varchar(10)) + ' minutes ago' end)
			--								else Cast((datepart(HOUR,NOW()) - datepart(HOUR,cast(A.CreatedOn as datetime))) as varchar(10)) + ' hours ago' end)
			--						else Cast((DAY(NOW()) - DAY(cast(A.CreatedOn as datetime))) as varchar(10)) + ' days ago' end)
			--			else Cast((MONTH(NOW()) - MONTH(cast(A.CreatedOn as datetime))) as varchar(10)) + ' months ago' end)
			--else Cast((YEAR(NOW()) - YEAR(cast(A.CreatedOn as datetime))) as varchar(10)) + ' years ago' end) AS Created,
			----'' as LastActivity,
			--A.CreatedOn,
			--(Select Max(TA.CreatedOn) From TicketAssignee TA Where TA.TicketId = A.Id) as AsigneeCreatedOn,
			--A.IsDeleted
		FROM Ticket A
		WHERE 
		--(EmployeeId = 0 or EmployeeId = '' or EmployeeId is null or A.Requester = EmployeeId)
		--A.Requester = EmployeeId
		(EmployeeId = 0 or EmployeeId = '' or EmployeeId is null or  A.Id in (Select TA.TicketId From TicketAssignee TA Where TA.AssigneeId = EmployeeId))
		--and (Year = 0 or YEAR(cast(A.CreatedOn as datetime)) = Year)
		--and (Month = 0 or MONTH(cast(A.CreatedOn as datetime)) = Month)
		--and cast(A.CreatedOn as date) between FromDate and ToDate
		--ORDER BY A.Id DESC
	) AS TDATA


Select --*
(Select count(0) From #TDATA B where B.Status = 'Open') as 'Open',
(Select count(0) From #TDATA B where B.Status = 'Close') as 'Close',
(Select count(0) From #TDATA B where B.Status = 'Reopen') as 'Reopen',
(Select count(0) From #TDATA B where B.Status = 'In Progress') as 'InProgress',
(Select count(0) From #TDATA B where B.Status = 'Answered') as 'Answered',
(Select count(0) From #TDATA B where B.Status = 'On Hold') as 'OnHold',
(Select count(0) From #TDATA B where B.Status = 'Completed') as 'Completed'


DROP TABLE #TDATA


END

--  exec USP_GetTicketForUser_Chart 0,''
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetTicketReplyByTicketId
(
	TicketId bigint 
)
BEGIN
	


	SELECT --* 
		Id,
		(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.RepliedbyBy) as RepliedbyBy,
      	A.TicketId,
		--A.ReplyType,
		(Select A2.DepartmentName from Departments A2 where A2.Id = (Select A1.DepartmentId from Employees A1 where A1.Id=A.RepliedbyBy)) as ReplyType,
		A.Reply,
		--Cast(A.CreatedOn as nvarchar(100)) as CreatedOn,
		FORMAT(A.CreatedOn,'dd-MM-yyyy h:mm tt') as CreatedOn,
		A.IsDeleted
	FROM TicketReply A
	Where TicketId = TicketId
	order by A.CreatedOn desc


END

--exec USP_GetTicketDetailForNotification 9, 1
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetTicketToNotifyManager
(
	Id bigint 
	--,ApproverId bigint 
)
BEGIN
	
	SET FMTONLY OFF

	SELECT * --,
	--DATE_ADD(A.CreatedOn, INTERVAL PreorityLimitHour HOUR) 
	Into #TempData
	From
	( 
		SELECT --* 
			Id,
			(Select FirstName+' '+LastName from Employees A1 where A1.Id=A.Requester) as Requester,
      		A.Title,
			A.Description,
			(SELECT A1.Name FROM Region A1 WHERE A1.Id = A.Region) as Region,
			(SELECT A1.Name FROM City A1 WHERE cast(A1.Id as nvarchar(50)) = A.City) as City,
			(SELECT A1.Title FROM TypeMaster A1 WHERE A1.Id = A.TypeId) as Type,
			(SELECT A1.Title FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as Preority,
			(SELECT LimitHour FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as PreorityLimitHour,
			A.Status,
			(SELECT /* LIMIT 1 */ Id from Employees A1 Where A1.DesignationId = 49) as ManagerId,
			(Select A2.FirstName+' '+A2.LastName from Employees A2 where A2.Id = (SELECT /* LIMIT 1 */ Id from Employees A1 Where A1.DesignationId = 49)) as ManagerName,
			(Select A2.Email from Employees A2 where A2.Id = (SELECT /* LIMIT 1 */ Id from Employees A1 Where A1.DesignationId = 49)) as ManagerEmail,
			A.CreatedOn,
			(Case when DATE_ADD(A.CreatedOn, INTERVAL Cast((SELECT LimitHour FROM PreorityMaster A1 WHERE A1.Id = A.PreorityId) as int) HOUR) <= NOW() then 1
				else 0 end) as NotifyStatus
		FROM Ticket A
		Where --Id = Id
		A.Status = 'Open'
		And IsManagerNotified = 0
	) AS TDATA
	Where NotifyStatus = 1

	Update Ticket Set IsManagerNotified = 1 Where Id in (Select A.Id From #TempData A)

	Update Ticket Set Status = 'Close' 
	Where Id in (	SELECT --* 
						Id--,
						--A.IsClosed,
						--(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then (FORMAT((Select Max(TA.CreatedOn) From TicketAssignee TA Where TA.TicketId = A.Id),'dd-MM-yyyy h:mm tt')) 
						--	else 'No Reply' end) AS LastActivity,
						--(Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then DATEDIFF(day, (cast((Select Max(TA.CreatedOn) From TicketAssignee TA Where TA.TicketId = A.Id) as date)) , NOW())
						--	else 0 end) AS LastActivity
					FROM Ticket A
					Where --Id = Id
					A.Status = 'Completed'
					and (IsClosed = 0 or IsClosed = '' or IsClosed is null )
					and (Case when (Select count(0) from TicketReply B where B.TicketId = A.Id) > 0 then DATEDIFF(HOUR, ((Select Max(TA.CreatedOn) From TicketAssignee TA Where TA.TicketId = A.Id)) , NOW())
							else 0 end) >= 24 
				)

	Select * From #TempData

	DROP TABLE #TempData

END

--exec USP_GetTicketToNotifyManager 0
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetTotalLikeComment
(
	WallId bigint 
)
BEGIN
	

	SELECT 
		LC.LikeOrComment,
		COUNT(1) AS Total
	FROM 
		LikeComment LC 
	WHERE 
		LC.ParentId=WallId  
		--AND LC.LikeOrComment=LikeOrComment
	GROUP BY LC.LikeOrComment
END

--exec USP_GetEmployeeDetailByEmailId 'ankit-gaurunicharm.com'
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetTransferSheetDataAccountantSales
(
	Approver BIGINT
)
BEGIN
	SELECT --* 
	   A.Id as ClaimId
      ,A.Requester as RequesterId
	  ,(Select IFNULL(A1.FirstName,'') + ' ' + IFNULL(A1.LastName,'') from EMS.Employees A1 where A1.Id=A.Requester) as RequesterName
	  ,(Select A1.EmpId from EMS.Employees A1 where A1.Id=A.Requester) as RequesterEmpId
	  ,(Select A2.DepartmentName from EMS.Departments A2 where A2.Id = (Select A1.DepartmentId from EMS.Employees A1 where A1.Id=A.Requester)) as Department
	  ,(Select A2.DesignationName from EMS.Designation A2 where A2.Id = (Select A1.DesignationId from EMS.Employees A1 where A1.Id=A.Requester)) as Designation
	  ,A.Year
	  ,A.Month
	  ,Sum(IFNULL(B.AmountPassedByAuditor,0)) as PaymentAmount
	  ,(Select A2.Title from EMS.ExpenseDesignation A2 where A2.Id = (Select A1.ExpenseDepartment from EMS.Employees A1 where A1.Id=A.Requester)) as ExpenseDesignation
	  ,(Select A1.State from EMS.Employees A1 where A1.Id=A.Requester) as State
	  ,(Select A1.BankAccountNo from EMS.Employees A1 where A1.Id=A.Requester) as BankAccountNo
	  ,(Select A1.BankName from EMS.Employees A1 where A1.Id=A.Requester) as BankName
	  ,(Select A1.IfscCode from EMS.Employees A1 where A1.Id=A.Requester) as IfscCode
	FROM 
		EMS_Expense.ClaimMasterSales A INNER JOIN EMS_Expense.ClaimDetailSales B ON A.Id=B.ClaimId
	WHERE 
		--A.Requester = Approver --AND 
		A.IsDeleted=0 and
		A.Status='Approved' and
		--(Select count(1) from EMS_Expense.ClaimAssignee A1 where A1.ClaimId=A.Id and A1.AssigneeId=Approver and A1.IsAssigneeAccess=1) > 0
		(Select count(1) from EMS_Expense.ClaimAssigneeSales A1 where A1.ClaimId=A.Id and A1.ApproveOrdeId = 3 and A1.IsAssigneeAccess = 1 and A1.AssigneeId=Approver ) > 0
	GROUP BY A.Id,A.Requester,A.Year,A.Month,A.ExpenseId,Format(A.CreatedOn,'dd/MM/yyyy'),A.Status
	ORDER BY A.Id ASC
END

--exec USP_GetTransferSheetDataAccountant 21
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetUpComingBirthday
(
	Id bigint 
)
BEGIN
	
	Select  *,
	Cast(DATENAME(dw, BirthdateNew) as nvarchar(20)) + ',' + left(Cast(MONTHNAME(BirthdateNew)  as nvarchar(20)),3) + ' ' + Cast(DAY(BirthdateNew) as nvarchar(20)) as Birthdate
	--INTO #TEMPDATA
	from 
	(
		SELECT --top 3 --* 
		A.Id,
		--FirstName + ' ' + LastName as Name,
		FirstName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as CreatedOn
		,A.UserPhoto
		--,(A.Birthdate) as Birthdate
		--,Cast(DATENAME(dw, A.Birthdate) as nvarchar(20)) + ',' + Cast(MONTHNAME(A.Birthdate)  as nvarchar(20)) + ' ' + Cast(DAY(A.Birthdate) as nvarchar(20)) as Birthdate

		,(
		   --CASE when( CAST(DATEPART(m, A.Birthdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Birthdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < CAST(NOW() AS CHAR(10)) then ( CAST(DATEPART(m, A.Birthdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Birthdate) AS VARCHAR) + '/' + CAST(YEAR(DATE_ADD(NOW(), INTERVAL 365 DAY)) AS VARCHAR) )
		   CASE when CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)  then DATE_ADD(CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME), INTERVAL 1 YEAR)
			else CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME)
			end
		 ) as BirthdateNew

		,(
			--CASE when ( CAST(DATEPART(m, NOW()) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Birthdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < cast(NOW() as date) then 1
			CASE WHEN (CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)) then 1
			else 0
			end
		 ) as Flag
		
	FROM Employees A
	where A.Id not in  (Case	
								When CAST(DATEPART(m, A.Birthdate) AS varchar) = 2 and CAST(DATEPART(d, A.Birthdate) AS varchar) = 29 and DAY(EOMONTH(DATEFROMPARTS(YEAR(NOW()),2,1))) = 28  then  A.Id
								--When DAY(EOMONTH(DATEFROMPARTS(YEAR(NOW()),2,1))) = 28 and DAY(EOMONTH(DATEFROMPARTS(A.Birthdate,2,1))) = 29 then  A.Id
								else 0
								end ) 
		And A.IsDeleted = 0
	--Order by BirthdateNew desc
	) as Tdata
	where --Birthdate is not null
		--and cast(BirthdateNew as date) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
		--and CAST(BirthdateNew AS CHAR(10)) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
		cast(BirthdateNew as date) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 15 DAY) as date)
	Order by Flag,BirthdateNew asc

	--SELECT --* 
	--Id,
	--Name,
	--Code,
	--Designation,
	--CreatedOn,
	--UserPhoto,
	--CAST(BirthdateNew AS CHAR(10)) as  BirthdateNew,
	--Flag,
	--Birthdate
	--FROM #TEMPDATA

	--DROP TABLE #TEMPDATA

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetUpComingBirthdayAll
(
	Id bigint 
)
BEGIN
	
	Select  *,
	Cast(DATENAME(dw, BirthdateNew) as nvarchar(20)) + ',' + Cast(MONTHNAME(BirthdateNew)  as nvarchar(20)) + ' ' + Cast(DAY(BirthdateNew) as nvarchar(20)) as Birthdate
	--INTO #TEMPDATA
	from 
	(
		SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as CreatedOn
		,A.UserPhoto
		--,(A.Birthdate) as Birthdate
		--,Cast(DATENAME(dw, A.Birthdate) as nvarchar(20)) + ',' + Cast(MONTHNAME(A.Birthdate)  as nvarchar(20)) + ' ' + Cast(DAY(A.Birthdate) as nvarchar(20)) as Birthdate

		,(
		   --CASE when( CAST(DATEPART(m, A.Birthdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Birthdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < CAST(NOW() AS CHAR(10)) then ( CAST(DATEPART(m, A.Birthdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Birthdate) AS VARCHAR) + '/' + CAST(YEAR(DATE_ADD(NOW(), INTERVAL 365 DAY)) AS VARCHAR) )
		   CASE when CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)  then DATE_ADD(CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME), INTERVAL 1 YEAR)
			else CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME)
			end
		 ) as BirthdateNew

		,(
			--CASE when ( CAST(DATEPART(m, NOW()) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Birthdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < cast(NOW() as date) then 1
			CASE WHEN (CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Birthdate) AS varchar) + '-' + CAST(DATEPART(d, A.Birthdate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)) then 1
			else 0
			end
		 ) as Flag
		
	FROM Employees A
		where A.Id not in  (Case	
								When CAST(DATEPART(m, A.Birthdate) AS varchar) = 2 and CAST(DATEPART(d, A.Birthdate) AS varchar) = 29 and DAY(EOMONTH(DATEFROMPARTS(YEAR(NOW()),2,1))) = 28  then  A.Id
								--When DAY(EOMONTH(DATEFROMPARTS(YEAR(NOW()),2,1))) = 28 and DAY(EOMONTH(DATEFROMPARTS(A.Birthdate,2,1))) = 29 then  A.Id
								else 0
								end ) 
	--Order by BirthdateNew desc
	) as Tdata
	--where Birthdate is not null
		--and cast(BirthdateNew as date) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
		--and CAST(BirthdateNew AS CHAR(10)) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
	Order by Flag,BirthdateNew asc

	--SELECT --* 
	--Id,
	--Name,
	--Code,
	--Designation,
	--CreatedOn,
	--UserPhoto,
	--CAST(BirthdateNew AS CHAR(10)) as  BirthdateNew,
	--Flag,
	--Birthdate
	--FROM #TEMPDATA

	--DROP TABLE #TEMPDATA

END

--exec USP_GetUpComingBirthdayAll 0
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetUpcomingHoliday
(
	Id bigint 
)
BEGIN
	
	SELECT /* LIMIT 3 */ *,
	Cast(DATENAME(dw, HolidayDateNew) as nvarchar(20)) + ',' + Cast(MONTHNAME(HolidayDateNew)  as nvarchar(20)) + ' ' + Cast(DAY(HolidayDateNew) as nvarchar(20)) as HolidayDate
	from 
	(
		SELECT --top 3 --* 
		A.Id
		--,CAST(A.CreatedOn AS CHAR) as CreatedOn
		,Name
		,(
		   CASE when CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)  then DATE_ADD(CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME), INTERVAL 1 YEAR)
			else CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME)
			end
		 ) as HolidayDateNew

		,(
			CASE WHEN (CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)) then 1
			else 0
			end
		 ) as Flag
		
	FROM Holiday A
	) as Tdata
	Order by Flag,HolidayDateNew asc


END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetUpcomingHolidayAll
(
	Id bigint 
)
BEGIN
	
	Select *,
	Cast(DATENAME(dw, HolidayDateNew) as nvarchar(20)) + ', ' +Cast(DAY(HolidayDateNew) as nvarchar(20)) + ' ' + Cast(MONTHNAME(HolidayDateNew)  as nvarchar(20)) + ' ' + Cast(YEAR(HolidayDateNew) as nvarchar(20)) as HolidayDate
	from 
	(
		SELECT --top 3 --* 
		A.Id
		--,CAST(A.CreatedOn AS CHAR) as CreatedOn
		,Name
		,(
		   CASE when CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)  then DATE_ADD(CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME), INTERVAL 1 YEAR)
			else CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME)
			end
		 ) as HolidayDateNew

		,(
			CASE WHEN (CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.HolidayDate) AS varchar) + '-' + CAST(DATEPART(d, A.HolidayDate) AS varchar) AS DATETIME) < cast(NOW() as DATETIME)) then 1
			else 0
			end
		 ) as Flag
		
	FROM Holiday A
	) as Tdata
	Order by Flag,HolidayDateNew asc


END

--exec USP_GetUpcomingHolidayAll 0
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetWallData
(
	Id bigint 
	, PageOffSet int
)
BEGIN
	
	DECLARE  PageSize as int
	SET PageSize = 5

	SELECT --* 
		A.Id,
		A.Title as Title,
		A.Description as Description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) as TotalHour,
		(Case when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) <= 1 then CAST(abs(TIMESTAMPDIFF(SECOND, NOW(), A.CreatedOn)%3600/60) AS CHAR(5)) + ' minutes ago'
			  when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) > 23 then CAST(A.CreatedOn AS CHAR)
			else CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) + ' hours ago'
			end) as CreatedTime ,
		A.Image,
		(Select FirstName + ' ' + LastName from Employees a1 where a1.Id = A.AddedBy) as AddedBy,
		(Select UserPhoto from Employees a1 where a1.Id = A.AddedBy) as UserPhoto,
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='LIKE') AS TotalLike,	--AND LC.UserId=A.AddedBy
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='COMMENT') AS TotalComment,
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='LIKE' AND LC.UserId=Id) AS UserLikeStatus
	FROM Wall A
	--WHERE A.Id = Id
	Order by A.CreatedOn desc
	OFFSET PageOffSet ROWS 
	FETCH NEXT PageSize ROWS ONLY;

END
 --exec  USP_GetWallData 0,0
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetWallDataForAPI
(
	Id bigint 
	, PageOffSet int
)
BEGIN
	
	DECLARE  PageSize as int
	SET PageSize = 10

	SELECT --* 
		A.Id,
		A.Title as Title,
		A.Description as Description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) as TotalHour,
		(Case when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) <= 1 then CAST(abs(TIMESTAMPDIFF(SECOND, NOW(), A.CreatedOn)%3600/60) AS CHAR(5)) + ' minutes ago'
			  when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) > 23 then CAST(A.CreatedOn AS CHAR)
			else CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) + ' hours ago'
			end) as CreatedTime ,
		A.Image,
		(Select FirstName + ' ' + LastName from Employees a1 where a1.Id = A.AddedBy) as AddedBy,
		(Select UserPhoto from Employees a1 where a1.Id = A.AddedBy) as UserPhoto,
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='LIKE') AS TotalLike,	--AND LC.UserId=A.AddedBy
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='COMMENT') AS TotalComment,
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='LIKE' AND LC.UserId=Id) AS UserLikeStatus
	FROM Wall A
	--WHERE A.Id = Id
	Order by A.CreatedOn desc
	OFFSET PageOffSet ROWS 
	FETCH NEXT PageSize ROWS ONLY;

END
 --exec  USP_GetWallData 0,0
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_GetWallDataWithoutOffset
(
	Id bigint 
)
BEGIN
	
	DECLARE  PageSize as int
	SET PageSize = 5

	SELECT --* 
		A.Id,
		A.Title as Title,
		A.Description as Description,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as Date,
		CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) as TotalHour,
		(Case when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) <= 1 then CAST(abs(TIMESTAMPDIFF(SECOND, NOW(), A.CreatedOn)%3600/60) AS CHAR(5)) + ' minutes ago'
			  when CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) > 23 then CAST(A.CreatedOn AS CHAR)
			else CAST(TIMESTAMPDIFF(SECOND, A.CreatedOn, NOW())/3600 AS CHAR(5)) + ' hours ago'
			end) as CreatedTime ,
		A.Image,
		(Select FirstName + ' ' + LastName from Employees a1 where a1.Id = A.AddedBy) as AddedBy,
		(Select UserPhoto from Employees a1 where a1.Id = A.AddedBy) as UserPhoto,
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='LIKE') AS TotalLike,	--AND LC.UserId=A.AddedBy
		(SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=A.Id  AND LC.LikeOrComment='COMMENT') AS TotalComment
	FROM Wall A
	--WHERE A.Id = Id
	Order by A.CreatedOn desc

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetWorkAnniversary
(
	Id bigint 
)
BEGIN
	
	Select  * ,(YEAR(JoiningdateNew) - YEAR(cast(Joiningdate1 as date))) As WorkYear from 
	(
	SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as CreatedOn,
		A.UserPhoto,
		(A.Joiningdate) as Joiningdate1,
		Cast(DATENAME(dw, A.Joiningdate) as nvarchar(20)) + ',' + Cast(MONTHNAME(A.Joiningdate)  as nvarchar(20)) + ' ' + Cast(DAY(A.Joiningdate) as nvarchar(20)) as Joiningdate

		,(
		 CASE when( CAST(DATEPART(m, A.Joiningdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < CAST(NOW() AS CHAR(10)) then ( CAST(DATEPART(m, A.Joiningdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(DATE_ADD(NOW(), INTERVAL 365 DAY)) AS VARCHAR) )
			else ( CAST(DATEPART(m, A.Joiningdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) )
			end
		 ) as JoiningdateNew
		,(
			CASE when( CAST(DATEPART(m, NOW()) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < CAST(NOW() AS CHAR(10)) then 1
			else 0
			end
		 ) as Flag
		 
	FROM Employees A
	Where A.IsDeleted = 0

	) as Tdata
	where Joiningdate is not null
		and cast(JoiningdateNew as date) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 15 DAY) as date)
	Order by Flag,JoiningdateNew asc

END

--	exec USP_GetWorkAnniversary 16
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_GetWorkAnniversaryAll
(
	Id bigint 
)
BEGIN
	
	Select  * ,(YEAR(JoiningdateNew) - YEAR(cast(Joiningdate1 as date))) As WorkYear from 
	(
	SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--A.Date,
		CAST(A.CreatedOn AS CHAR) as CreatedOn,
		A.UserPhoto,
		(A.Joiningdate) as Joiningdate1,
		Cast(DATENAME(dw, A.Joiningdate) as nvarchar(20)) + ',' + Cast(MONTHNAME(A.Joiningdate)  as nvarchar(20)) + ' ' + Cast(DAY(A.Joiningdate) as nvarchar(20)) as Joiningdate

		,(
		 CASE when( CAST(DATEPART(m, A.Joiningdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < CAST(NOW() AS CHAR(10)) then ( CAST(DATEPART(m, A.Joiningdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(DATE_ADD(NOW(), INTERVAL 365 DAY)) AS VARCHAR) )
			else ( CAST(DATEPART(m, A.Joiningdate) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) )
			end
		 ) as JoiningdateNew
		,(
			CASE when( CAST(DATEPART(m, NOW()) AS VARCHAR) + '/' + CAST(DATEPART(d, A.Joiningdate) AS VARCHAR) + '/' + CAST(YEAR(NOW()) AS VARCHAR) ) < CAST(NOW() AS CHAR(10)) then 1
			else 0
			end
		 ) as Flag
		 
	FROM Employees A

	) as Tdata
	where Joiningdate is not null
		and cast(JoiningdateNew as date) between cast(NOW() as date) and cast(DATE_ADD(NOW(), INTERVAL 365 DAY) as date)
	Order by Flag,JoiningdateNew asc

END

--	exec USP_GetWorkAnniversaryAll 1
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetWorkAnniversaryToday
(
	Id bigint 
)
BEGIN
	
	Select  *,
	Cast(TIMESTAMPDIFF(YEAR, Joiningdate2, NOW()) as varchar(10)) + ' years completed' as Joiningdate
	from 
	(
		SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		CAST(A.CreatedOn AS CHAR) as CreatedOn
		,A.UserPhoto
		,(
		  CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Joiningdate) AS varchar) + '-' + CAST(DATEPART(d, A.Joiningdate) AS varchar) AS DATETIME)
		 ) as JoiningdateNew

		,1 as Flag
		,cast(NOW() as date) aa
		,A.Joiningdate as Joiningdate2
	FROM Employees A
	) as Tdata
	where Cast(JoiningdateNew as date) = cast(NOW() as date)
	Order by Flag,JoiningdateNew asc



END

--exec USP_GetWorkAnniversaryToday 0
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_GetWorkAnniversaryTodayByUser
(
	Id bigint,
	Type nvarchar(100) 
)
BEGIN
	
--	--supplying a data contract
--IF 1 = 2 BEGIN
--    SELECT
--        cast(null as bigint)  as MyPrimaryKey,
--        cast(null as int)    as OtherColumn
--    WHERE
--        1 = 2  
--END

SET FMTONLY OFF

	Select  *,
	Cast(TIMESTAMPDIFF(YEAR, Joiningdate2, NOW()) as varchar(10)) + ' ' as Joiningdate	
	into #Temdata
	from 
	(
		SELECT --top 3 --* 
		A.Id,
		FirstName + ' ' + LastName as Name,
		Upper(left(FirstName,1) + Left(LastName,1)) as Code,
		--(Select a2.DesignationName from Designation a2 where a2.Id = A.DesignationId) as Designation,
		--CAST(A.CreatedOn AS CHAR) as CreatedOn,
		A.UserPhoto
		,(
		  CAST(CAST(YEAR(NOW()) AS varchar) + '-' + CAST(DATEPART(m, A.Joiningdate) AS varchar) + '-' + CAST(DATEPART(d, A.Joiningdate) AS varchar) AS DATETIME)
		 ) as JoiningdateNew

		--,1 as Flag
		--,cast(NOW() as date) aa
		,A.Joiningdate as Joiningdate2
	FROM Employees A
	) as Tdata
	where Cast(JoiningdateNew as date) = cast(NOW() as date)
		and Id = Id
	Order by JoiningdateNew asc	--Flag,JoiningdateNew asc

	Select * from 
	(
	Select 
		A.Id,A.Name,A.Code,A.UserPhoto,A.JoiningdateNew,A.Joiningdate2,A.Joiningdate,'0' AS CFlag ,
		'' as Comment
	from 
		#Temdata A

		union

	Select 
		B.CommentUserId as Id, 
		(Select A1.FirstName + ' ' + A1.LastName from Employees A1 where A1.Id=B.CommentUserId) Name,
		(Select Upper(left(A1.FirstName,1) + Left(A1.LastName,1)) from Employees A1 where A1.Id=B.CommentUserId) Code,
		(Select A1.UserPhoto from Employees A1 where A1.Id=B.CommentUserId) UserPhoto,
		'' as JoiningdateNew,'' as Joiningdate2,'' as Joiningdate,'1' AS CFlag ,
		B.Comment
	from 
		TodaysBirthdateAndAnniversary B inner join #Temdata A on A.Id=B.BirthdateUsertId
	where
		B.BirthdateUsertId = Id	and
		B.Type = 'WORKANNIVERSARY' 
		and Cast(Birthdate as date) = cast(NOW() as date)
	) As Data2
		


	drop table #Temdata

END

--exec USP_GetWorkAnniversaryTodayByUser 212, ''
 //
DELIMITER ;


DELIMITER //
create PROCEDURE USP_LoginExpensePortal
(
	Id bigint 
)
BEGIN

	Declare Token as nvarchar(500)

	if (Select count(1) from Employees where Id = Id) > 0
		Begin
			 SET Token = CAst(Id as varchar(10)) + (SELECT cast((Abs(Checksum(UUID()))%10) as varchar(1)) + 
			   char(ascii('a')+(Abs(Checksum(UUID()))%25)) +
			   char(ascii('A')+(Abs(Checksum(UUID()))%25)) +
			   left(UUID(),20) )

			Update Employees Set LoginToken=Token Where Id = Id
		End

	Select Token

END

--exec USP_LoginExpensePortal 100
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_SaveAndGetLikeComment
(
	Type nvarchar(100)  
	,LikeOrComment nvarchar(100) 
	,Comment nvarchar(500) 
	,ParentId bigint 
	,UserId bigint 
)
BEGIN
	
	DECLARE Count bigint

	IF Type = 'WALL'
		BEGIN
			IF LikeOrComment = 'LIKE'
				BEGIN
					IF (SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=ParentId AND LC.UserId=UserId AND LikeOrComment='LIKE') = 0
						BEGIN
							INSERT INTO LikeComment(Type, LikeOrComment, Comment, ParentId, UserId)
										VALUES(Type, LikeOrComment, Comment, ParentId, UserId)
										--SELECT Id=@IDENTITY
						END
				END
			ELSE IF LikeOrComment = 'UNLIKE'
				BEGIN
					IF (SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=ParentId AND LC.UserId=UserId AND LikeOrComment='LIKE') > 0
						BEGIN
							DELETE FROM LikeComment WHERE 
								ParentId=ParentId 
								AND UserId=UserId 
								AND LikeOrComment='LIKE'
						END
				END
			ELSE IF LikeOrComment = 'COMMENT'
				BEGIN
					INSERT INTO LikeComment(Type, LikeOrComment, Comment, ParentId, UserId)
								VALUES(Type, LikeOrComment, Comment, ParentId, UserId)
								--SELECT Id=@IDENTITY
				END
		END

		SET Count = (SELECT COUNT(1) FROM LikeComment LC WHERE LC.ParentId=ParentId  AND LC.LikeOrComment=LikeOrComment)	--AND LC.UserId=UserId

	SELECT CONVERT(Count, INT) as TotalCount	--1
END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_SaveCommentOnTodaysBirthday
(
		   Type nvarchar(100) 
		  ,BirthdateUsertId bigint 
		  ,Birthdate date 
		  ,Comment nvarchar(max) 
		  ,CommentUserId bigint 
		  ,CreatedOn datetime 
)
BEGIN
	
	INSERT INTO 
		TodaysBirthdateAndAnniversary
		(
		   Type
		  ,BirthdateUsertId
		  ,Birthdate
		  ,Comment
		  ,CommentUserId
		  ,CreatedOn
		)
	VALUES
		(
		   Type
		  ,BirthdateUsertId
		  ,Birthdate
		  ,Comment
		  ,CommentUserId
		  ,CreatedOn
		)

END
 //
DELIMITER ;


DELIMITER //
create procedure USP_SavemasterLogs
(	
	UserId bigint,
	LoginUserType int,
	Module nvarchar(100),
	ModuleId bigint,
	Description nvarchar(max),
	Action nvarchar(100)
)
BEGIN

	DECLARE Id AS BIGINT

	insert into masterLogs (
								UserId ,
								LoginUserType,
								Module  ,
								ModuleId ,
								Description ,
								CreatedDate,
								IsDeleted,
								Action
							)
					values(
								UserId ,
								LoginUserType ,
								Module  ,
								ModuleId ,
								Description ,
								NOW() ,
								0,
								Action
							)			
	set Id = (select @IDENTITY)


	Select * 
	from masterLogs a 
	where a.Id = Id

END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_UpdateDeviceId
(
	EmployeeId bigint ,
	DeviceId nvarchar(100) 
)
BEGIN
	
	Update Employees set DeviceId = DeviceId where Id = EmployeeId

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_UpdateEmployeeExpenseDetail
(
	Email nvarchar(100) 
	,EmpId nvarchar(100) 
	,Category nvarchar(100) 
	,Unit nvarchar(100) 
	,Zone nvarchar(100) 
	,Location nvarchar(100) 
	,State nvarchar(100) 
	,City nvarchar(100) 
	,Supervisor nvarchar(100) 
	,SupervisorEmpId nvarchar(100) 
	,BankAccountNo nvarchar(100) 
	,BankName nvarchar(100) 
	,IfscCode nvarchar(100) 
	,LoginToken nvarchar(100) 
	,ExpenseDepartment nvarchar(100) 
	,UserType nvarchar(100) 
	,TTMT nvarchar(100) 
)
BEGIN
	

	Declare 
	 Unit2 as nvarchar(100) = (Select A.Id from EMS.Units A Where A.Title = Unit)
	,Zone2 as nvarchar(100) -- = (Select A.Id from EMS.Zone A Where A.Title = Zone and A.Unit = Unit2)
	,Location2 as nvarchar(100)  = (Select A.Id from EMS.Location A Where A.LocationName = Location)
	,ExpenseDepartment2 as nvarchar(100)  = (Select A.Id from EMS.ExpenseDesignation A Where A.Title = ExpenseDepartment)

	Set Zone2 = (Select A.Id from EMS.Zone A Where A.Title = Zone and A.Unit = Unit2)

	UPDATE
		Employees
	SET
		EmpId= EmpId
		,Category=Category
		,Unit=Unit2
		,Zone=Zone2
		,Location=Location2
		,State=State
		,City=City
		,Supervisor=Supervisor
		,SupervisorEmpId=SupervisorEmpId
		,BankAccountNo=BankAccountNo
		,BankName=BankName
		,IfscCode=IfscCode
		--,LoginToken=LoginToken
		,ExpenseDepartment=ExpenseDepartment2
		,UserType=UserType
		,TTMT=TTMT
	WHERE 
		Email = Email

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_UpdateMeetingData
(
	Id bigint ,
	Location bigint,
	Floor bigint,
	Room bigint,
	Date date,
	TimeFrom varchar(100),
	TimeTo varchar(100),
	Purpose varchar(1000)
)
BEGIN
	
	Update MeetingDetails 
	Set
		Location = Location,
		Floor = Floor,
		Room = Room,
		Date = Date,
		TimeFrom = TimeFrom,
		TimeTo = TimeTo,
		Purpose = Purpose
	Where Id = Id



END
 //
DELIMITER ;


DELIMITER //
Create PROCEDURE USP_UpdatePassword
(
	EmployeeId bigint ,
	Password nvarchar(100) 
)
BEGIN
	
	Update Employees set Password = Password where Id = EmployeeId

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_UpdateProfile
(
	Id bigint ,
	FirstName nvarchar(100) ,
	LastName nvarchar(100) ,
	MobileNo1 nvarchar(100) ,
	UserPhoto nvarchar(max) 
)
BEGIN
	

	UPDATE
		Employees
	SET
		FirstName=FirstName,
		LastName=LastName,
		MobileNo1=MobileNo1,
		UserPhoto=UserPhoto
	WHERE 
		Id = Id

END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_ValidateMeetingTime
(
	Date date,
	TimeFrom nvarchar(50) ,
	Room bigint
)
BEGIN

	SELECT --* 
		count(1) as TCount
	FROM MeetingDetails A
	WHERE A.Date = Date 	
	and A.Room = Room
	--and A.TimeFrom = TimeFrom
	--and (TimeFrom >= TimeFrom and  TimeFrom < TimeTo)
	and (cast(TimeFrom as decimal(18,2)) >= cast(TimeFrom as decimal(18,2)) and  cast(TimeFrom as decimal(18,2)) < cast(TimeTo as decimal(18,2)))
	--and (cast(TimeFrom as decimal(18,2)) between cast(TimeFrom as decimal(18,2)) and cast(TimeTo as decimal(18,2)))


END
 //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE USP_ValidateMeetingTimeTo
(
	Date date,
	TimeFrom nvarchar(50) ,
	TimeTo nvarchar(50) ,
	Room bigint
)
BEGIN

--IF 1 = 1 
--BEGIN

--END

SET FMTONLY OFF

Declare TCount as int

	--SELECT --* 
	--	count(1) as TCount
	--FROM MeetingDetails A
	--WHERE A.Date = Date 	
	--and A.Room = Room
	----and A.TimeFrom = TimeFrom
	----and (TimeFrom >= TimeFrom and  TimeFrom < TimeTo)
	--and (
	--	cast(TimeTo as decimal(18,2)) > cast(TimeFrom as decimal(18,2)) 
	--		and  
	--	cast(TimeTo as decimal(18,2)) <= cast(TimeTo as decimal(18,2))
	--	)
	----and (cast(TimeFrom as decimal(18,2)) between cast(TimeFrom as decimal(18,2)) and cast(TimeTo as decimal(18,2)))



	--SELECT ones.n
	--INTO #TEMPTIMES
	--FROM (VALUES('08'),('08.5'),('09'),('09.5'),('10'),('10.5'),('11'),('11.5'),('12'),('12.5'),('13'),('13.5'),('14'),('14.5'),('15'),('15.5'),('16'),('16.5'),('17'),('17.5'),('18'),('18.5'),('19'),('19.5'),('20')) ones(n)
	--WHERE ones.n between TimeFrom and TimeTo

	--SELECT n FROM #TEMPTIMES

	SET TCount = (SELECT --* 
						count(1) as TCount
					FROM MeetingDetails A
					WHERE A.Date = Date 	
					and A.Room = Room
					--and (
					--	(cast(TimeFrom as decimal(18,2)) + 0.5) in (SELECT n FROM #TEMPTIMES)
					--	or 
					--	cast(TimeTo as decimal(18,2)) in (SELECT n FROM #TEMPTIMES)
					--	))
				 	and (
						(cast(TimeFrom as decimal(18,2)) + 0.5) in (	SELECT ones.n
																	FROM (VALUES('08'),('08.5'),('09'),('09.5'),('10'),('10.5'),('11'),('11.5'),('12'),('12.5'),('13'),('13.5'),('14'),('14.5'),('15'),('15.5'),('16'),('16.5'),('17'),('17.5'),('18'),('18.5'),('19'),('19.5'),('20')) ones(n)
																	WHERE ones.n between TimeFrom and TimeTo)
						--or 
						--cast(TimeTo as decimal(18,2))
						--										 in (	SELECT ones.n
						--											FROM (VALUES('08'),('08.5'),('09'),('09.5'),('10'),('10.5'),('11'),('11.5'),('12'),('12.5'),('13'),('13.5'),('14'),('14.5'),('15'),('15.5'),('16'),('16.5'),('17'),('17.5'),('18'),('18.5'),('19'),('19.5'),('20')) ones(n)
						--											WHERE ones.n between TimeFrom and TimeTo)
						))
	
	--DROP TABLE #TEMPTIMES


	SELECT TCount as TCount




END

--  exec USP_ValidateMeetingTimeTo '2021-01-29 14:13:48.690',11,11,1
 //
DELIMITER ;


