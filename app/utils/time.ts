// app/utils/time.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc'; // <-- 1. Import plugin UTC

// Mở rộng dayjs với cả hai plugin
dayjs.extend(relativeTime);
dayjs.extend(utc); // <-- 2. Sử dụng plugin UTC

export const formatPostedAt = (dateString: string | Date): string => {
  if (!dateString) return '';

  // 3. Phân tích chuỗi đầu vào và coi nó là giờ UTC một cách tường minh
  const postTime = dayjs.utc(dateString);

  // So sánh với thời gian hiện tại (dayjs().from() tự động xử lý múi giờ)
  // Logic còn lại không cần thay đổi
  const diffInHours = dayjs().diff(postTime, 'hour');

  if (diffInHours < 24) {
    // .fromNow() sẽ so sánh với giờ địa phương của người dùng, cho kết quả đúng
    return postTime.fromNow(); 
  } else {
    // .format() cũng sẽ tự động chuyển sang giờ địa phương
    return postTime.format('DD/MM/YYYY');
  }
};
