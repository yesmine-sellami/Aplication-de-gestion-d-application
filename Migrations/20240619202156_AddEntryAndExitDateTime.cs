using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sopalapp.Migrations
{
    /// <inheritdoc />
    public partial class AddEntryAndExitDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EntryDateTime",
                table: "Visitors",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExitDateTime",
                table: "Visitors",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntryDateTime",
                table: "Visitors");

            migrationBuilder.DropColumn(
                name: "ExitDateTime",
                table: "Visitors");
        }
    }
}
