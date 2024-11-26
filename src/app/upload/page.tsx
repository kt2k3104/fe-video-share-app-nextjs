"use client";
import { Button } from "@/components/ui/button";
import { Toaster, toaster } from "@/components/ui/toaster";
import requestApi from "@/utils/api";
import { Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { request } from "http";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface UploadVideoForm {
  file: FileList;
  title?: string;
  description?: string;
  start_time_to_set_thumb?: number;
}

export default function UploadPage() {
  useEffect(() => {
    document.title = "Upload Video";
  }, []);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UploadVideoForm>();

  const onSubmit = async (data: UploadVideoForm) => {
    if (!data.file?.[0]) {
      alert("Vui lòng chọn file video!");
      return;
    }

    const formData = new FormData();
    formData.append("video", data.file[0]);
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.start_time_to_set_thumb) {
      formData.append(
        "start_time_to_set_thumb",
        data.start_time_to_set_thumb.toString()
      );
    }

    setLoading(true);
    try {
      const response = await requestApi("videos", "POST", formData);
      if (response.data.success) {
        toaster.create({
          type: "success",
          title: "Upload thành công",
          duration: 3000,
        });
      } else {
        toaster.create({
          type: "error",
          title: "Upload thất bại",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Lỗi upload:", error);
      if (error.response.data.message === "No auth token") {
        alert("Token hết hạn, Vui lòng đăng nhập lại để upload video!");
      } else {
        alert("Đã xảy ra lỗi khi upload!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={"1"} h={"calc(100vh - 110px)"} textAlign={"center"}>
      <Toaster />
      <Text
        lineHeight={"100px"}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        fontSize={"2xl"}
        color={"#c4c4c4"}
      >
        upload video
      </Text>
      {loading ? (
        <VStack h={"calc(100% - 100px)"} justifyContent={"center"} pb={"100px"}>
          <Spinner size={"xl"} />
        </VStack>
      ) : (
        <VStack
          h={"calc(100% - 100px)"}
          display={"flex"}
          justifyContent={"center"}
          pb={"100px"}
        >
          <form
            style={{
              maxWidth: "700px",
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="file"
              accept="video/*"
              {...register("file", { required: "Vui lòng chọn file video!" })}
            />
            {errors.file && (
              <p style={{ color: "red" }}>{errors.file.message}</p>
            )}

            <HStack
              w={"100%"}
              h={"36px"}
              m={"20px 0"}
              justifyContent={"space-between"}
            >
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="Title"
                style={{ width: "360px" }}
                {...register("title")}
              />
            </HStack>
            <HStack
              w={"100%"}
              h={"36px"}
              m={"20px 0"}
              justifyContent={"space-between"}
            >
              <label htmlFor="description">Description</label>
              <input
                type="text"
                placeholder="Description"
                style={{ width: "360px" }}
                {...register("description")}
              />
            </HStack>
            <HStack
              w={"100%"}
              h={"36px"}
              m={"20px 0"}
              justifyContent={"space-between"}
            >
              <label htmlFor="start_time_to_set_thumb">
                Start time to set Thumb
              </label>
              <input
                type="text"
                placeholder="Start time to set Thumb"
                style={{ width: "360px" }}
                {...register("start_time_to_set_thumb")}
              />
            </HStack>
            <Button type="submit">Upload</Button>
          </form>
        </VStack>
      )}
    </Box>
  );
}
