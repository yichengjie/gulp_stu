@echo off
set build=b
set deploy=d
if "%1" == "%build%" (
	spm build
) else if "%1" == "%deploy%" (
	rd sea-modules\fare /s /q
	md sea-modules\fare
	md sea-modules\fare\oc
	md sea-modules\fare\oc\1.0.0
	md sea-modules\fare\oc\1.0.0\edit
	md sea-modules\fare\oc\1.0.0\abr

	xcopy dist\*.* sea-modules\fare\oc\1.0.0
	xcopy dist\edit\*.* sea-modules\fare\oc\1.0.0\edit
	xcopy dist\abr\*.* sea-modules\fare\oc\1.0.0\abr
) else (
	echo error command: b d
)