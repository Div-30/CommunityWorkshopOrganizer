using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityWorkshopOrganizer.Migrations
{
    /// <inheritdoc />
    public partial class AddRejectionAndOrganiserFlow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Workshops",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrganiserRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    RejectionReason = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganiserRequests", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_OrganiserRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrganiserRequests_UserId",
                table: "OrganiserRequests",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrganiserRequests");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Workshops");
        }
    }
}
