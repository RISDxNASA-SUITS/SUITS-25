
import {SemiCircleProgress} from 'react-semicircle-progressbar';

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
             <SemiCircleProgress
        percentage={80}
        size={{
          width: 200,
          height: 200,
        }}
        strokeWidth={10}
        strokeColor="#f00"
      />
        </div>
    );
}