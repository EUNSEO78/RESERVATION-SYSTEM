export const validationConfig = {
  transform: true, // DTO 클래스의 인스턴스로 변환
  whitelist: true, // DTO에 정의되지 않은 속성 제거
  forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 예외 발생
};
