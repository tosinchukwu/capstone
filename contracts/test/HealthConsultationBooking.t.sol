// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {HealthConsultationBooking} from "../src/HealthConsultationBooking.sol";

contract HealthConsultationBookingTest is Test {
    HealthConsultationBooking public booking;
    address public patient = address(0x1);
    address public doctor = address(0x2);

    function setUp() public {
        booking = new HealthConsultationBooking();
    }

    function test_CreateAppointment() public {
        vm.prank(patient);
        booking.createAppointment(doctor, block.timestamp + 1 days);
        (uint256 id, address patientAddr, address doctorAddr, , bool confirmed, bool completed) =
            booking.getAppointment(0);
        assertEq(id, 0);
        assertEq(patientAddr, patient);
        assertEq(doctorAddr, doctor);
        assertFalse(confirmed);
        assertFalse(completed);
    }

    function test_ConfirmAppointment() public {
        vm.prank(patient);
        booking.createAppointment(doctor, block.timestamp + 1 days);
        vm.prank(doctor);
        booking.confirmAppointment(0);
        (, , , , bool confirmed, ) = booking.getAppointment(0);
        assertTrue(confirmed);
    }

    function test_CompleteAppointment() public {
        vm.prank(patient);
        booking.createAppointment(doctor, block.timestamp + 1 days);
        vm.prank(doctor);
        booking.confirmAppointment(0);
        vm.prank(doctor);
        booking.completeAppointment(0);
        (, , , , , bool completed) = booking.getAppointment(0);
        assertTrue(completed);
    }

    function test_OnlyDoctorCanConfirm() public {
        vm.prank(patient);
        booking.createAppointment(doctor, block.timestamp + 1 days);
        vm.prank(patient);
        vm.expectRevert("Only doctor");
        booking.confirmAppointment(0);
    }
}
