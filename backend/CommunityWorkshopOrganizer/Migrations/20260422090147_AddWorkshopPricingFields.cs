using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityWorkshopOrganizer.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkshopPricingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPaid",
                table: "Workshops",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Workshops",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPaid",
                table: "Workshops");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Workshops");
        }
    }
}
