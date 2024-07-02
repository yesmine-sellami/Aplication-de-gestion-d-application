﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using sopalapp.Models;

#nullable disable

namespace sopalapp.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240614150023_NomDeLaMigration")]
    partial class NomDeLaMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("sopalapp.Models.Visitor", b =>
                {
                    b.Property<string>("CIN")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ButVisite")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Nom")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Prénom")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Société")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CIN");

                    b.ToTable("Visitors");
                });
#pragma warning restore 612, 618
        }
    }
}
