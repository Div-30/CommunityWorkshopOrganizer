using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityWorkshopOrganizer.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkshopStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Workshops",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Workshops");
        }
    }
}
