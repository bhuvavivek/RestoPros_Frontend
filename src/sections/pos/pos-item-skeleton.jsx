import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function PosItemSkeleton() {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={200} animation="wave" />
      ))}
    </Box>
  );
}
