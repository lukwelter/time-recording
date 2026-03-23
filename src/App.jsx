import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Square, TimerReset, CalendarDays, Clock3, Download } from "lucide-react";
import { motion } from "framer-motion";

const STORAGE_KEY = "weekly-time-tracker-v1";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function formatMinutes(ms) {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} Min`;
  if (minutes === 0) return `${hours} Std`;
  return `${hours} Std ${minutes} Min`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getISOWeekInfo(dateInput) {
  const date = new Date(dateInput);
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return { year: tmp.getUTCFullYear(), week };
}

function getWeekLabel(dateInput) {
  const { year, week } = getISOWeekInfo(dateInput);
  return `${year}-KW${pad(week)}`;
}

function getWeekRangeFromLabel(label) {
  const match = label.match(/^(\d{4})-KW(\d{2})$/);
  if (!match) return label;
  const year = Number(match[1]);
  const week = Number(match[2]);

  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay() || 7;
  const monday = new Date(simple);
  if (dow <= 4) {
    monday.setUTCDate(simple.getUTCDate() - dow + 1);
  } else {
    monday.setUTCDate(simple.getUTCDate() + 8 - dow);
  }
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
}