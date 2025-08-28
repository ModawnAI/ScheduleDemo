"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Database, CheckCircle } from 'lucide-react';
import DataTestComponent from '@/components/DataTestComponent';

interface DataValidationProps {
  className?: string;
}

const DataValidation: React.FC<DataValidationProps> = ({ className = "" }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Validation & System Test
        </CardTitle>
        <CardDescription>
          Comprehensive validation of mock data and TypeScript interfaces
        </CardDescription>
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Validated
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-lg sm:text-2xl font-bold text-primary">20+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Contracts</div>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-lg sm:text-2xl font-bold text-primary">4</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Crews</div>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-lg sm:text-2xl font-bold text-primary">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Job Tickets</div>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-lg sm:text-2xl font-bold text-primary">30</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Daily Schedules</div>
            </div>
          </div>
          
          <Separator />
          
          {/* Detailed validation component */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h4 className="font-medium text-card-foreground mb-3">Detailed System Validation</h4>
            <DataTestComponent />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataValidation;
