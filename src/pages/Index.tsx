import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';

const Index: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to JSON Toolkit</h1>
          <p className="text-muted-foreground">
            A collection of tools to help you work with JSON data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>JSON Compare</CardTitle>
              <CardDescription>
                Compare two JSON objects and see the differences between them
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>
                Our JSON comparison tool highlights differences between two JSON objects,
                making it easy to spot changes, additions, and deletions.
              </p>
            </CardContent>
            <CardFooter className="mt-auto pt-4">
              <Link to="/json-compare" className="w-full">
                <Button className="w-full">Open JSON Compare Tool</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Translation Checker</CardTitle>
              <CardDescription>
                Find missing translation keys and validate your localization files
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>
                The translation checker helps you identify missing keys, untranslated strings,
                and formatting issues in your localization files.
              </p>
            </CardContent>
            <CardFooter className="mt-auto pt-4">
              <Link to="/translation-checker" className="w-full">
                <Button className="w-full">Open Translation Checker</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
