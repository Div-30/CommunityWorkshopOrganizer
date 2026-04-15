using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityWorkshopOrganizer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Registrations_Users_UserId",
                table: "Registrations");

            migrationBuilder.DropForeignKey(
                name: "FK_Workshops_Users_OrganizerId",
                table: "Workshops");

            migrationBuilder.AddForeignKey(
                name: "FK_Registrations_Users_UserId",
                table: "Registrations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Workshops_Users_OrganizerId",
                table: "Workshops",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Registrations_Users_UserId",
                table: "Registrations");

            migrationBuilder.DropForeignKey(
                name: "FK_Workshops_Users_OrganizerId",
                table: "Workshops");

            migrationBuilder.AddForeignKey(
                name: "FK_Registrations_Users_UserId",
                table: "Registrations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Workshops_Users_OrganizerId",
                table: "Workshops",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
