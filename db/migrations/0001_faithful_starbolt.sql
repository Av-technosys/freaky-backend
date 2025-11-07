CREATE TYPE "public"."pricing_type_enum" AS ENUM('flat', 'percentage', 'tier', 'modular');--> statement-breakpoint
CREATE TYPE "public"."product_media_type_enum" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."product_type_enum" AS ENUM('product', 'addon');--> statement-breakpoint
CREATE TYPE "public"."review_media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'cancelled');