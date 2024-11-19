"use client";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

export default function FollowingPage() {
  useEffect(() => {
    document.title = "Following";
  }, []);
  return <Box>following</Box>;
}
