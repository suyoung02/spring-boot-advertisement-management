import { apiGet } from "./api";

export const searchPlaceApi = async (text: string) => {
  try {
    const res = await apiGet(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        fields: "formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry",
        input: text,
        inputtype: "textquery",
        key: "AIzaSyAESSzwLBdEfkk_WpjVmHQ7_1s15q_S4rg",
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
