"use client";

import { Palette } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeButton } from "./theme-button";

export function SettingsContent() {
  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="space-y-2">
        <h3 className="font-semibold text-2xl tracking-tight">Preferences</h3>
        <p className="text-base text-muted-foreground">
          Customize your experience and preferences
        </p>
      </div>

      <Card>
        <CardContent>
          <CardHeader className="grid-cols-[auto_1fr] p-0">
            <div className="rounded-lg bg-primary/10 p-3">
              <Palette className="size-5 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose how Task Manager looks to you
              </CardDescription>
            </div>
          </CardHeader>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <ThemeButton theme="light" />
            <ThemeButton theme="dark" />
            <ThemeButton theme="system" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
